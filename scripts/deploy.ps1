<#
.SYNOPSIS
    Build the site image and export it as a tarball, ready to copy to the VM.

.DESCRIPTION
    Builds on the workstation, not the VM: `next build` needs about 2 GB of RAM,
    and a build that fails here never reaches the server.

    Stops at the tarball. Copying, loading and swapping the container are done
    by hand; the commands are printed at the end (details in DEPLOYMENT.md).

.PARAMETER SiteUrl
    Public origin, baked into canonical tags, sitemap.xml and robots.txt AT
    BUILD TIME. Setting it in the VM's env file does nothing.

.PARAMETER Staging
    Builds with NEXT_PUBLIC_NOINDEX=1: robots.txt disallows everything and
    every page is noindex. Use for any non-production address.

.PARAMETER SkipTests
    Skips lint and the Playwright suite. Use sparingly.

.EXAMPLE
    .\scripts\deploy.ps1

.EXAMPLE
    .\scripts\deploy.ps1 -SiteUrl https://staging.aceparts.co.th -Staging
#>
[CmdletBinding()]
param(
    [string] $SiteUrl = 'https://aceparts.co.th',
    [switch] $Staging,
    [switch] $SkipTests
)

$ErrorActionPreference = 'Stop'

$name  = 'aceparts-web'
$image = "${name}:latest"
$root  = Split-Path $PSScriptRoot -Parent
$tar   = Join-Path $root "$name.tar"

Push-Location $root
try {
    if (-not $SkipTests) {
        Write-Host "`n== Lint and tests ==" -ForegroundColor Cyan
        npm run lint
        if ($LASTEXITCODE -ne 0) { throw 'Lint failed - nothing was built.' }
        npm run test:e2e
        if ($LASTEXITCODE -ne 0) { throw 'Tests failed - nothing was built.' }
    }

    $noindex = if ($Staging) { '1' } else { '' }
    Write-Host "`n== Build ($SiteUrl$(if ($Staging) { ', staging/noindex' })) ==" -ForegroundColor Cyan
    docker build --build-arg "NEXT_PUBLIC_SITE_URL=$SiteUrl" --build-arg "NEXT_PUBLIC_NOINDEX=$noindex" -t $image .
    if ($LASTEXITCODE -ne 0) { throw 'docker build failed.' }

    Write-Host "`n== Export ==" -ForegroundColor Cyan
    docker save -o $tar $image
    if ($LASTEXITCODE -ne 0) { throw 'docker save failed.' }
    $mb = [math]::Round((Get-Item $tar).Length / 1MB)
    Write-Host "  $tar ($mb MB)"

    Write-Host "`nBuilt. Copy it up and swap the container (env check, verify, rollback: DEPLOYMENT.md):" -ForegroundColor Green
    Write-Host "  scp .\$name.tar <user>@<vm-host>:~/"
    Write-Host "  ssh <user>@<vm-host>"
    Write-Host "  sudo docker tag $image ${name}:previous"
    Write-Host "  sudo docker load -i ~/$name.tar && rm ~/$name.tar"
    Write-Host "  sudo docker rm $name-old 2>/dev/null || true"
    Write-Host "  sudo docker rename $name $name-old && sudo docker stop $name-old"
    Write-Host "  sudo docker run -d --name $name --restart unless-stopped -p 127.0.0.1:3000:3000 --env-file ~/$name.env --log-opt max-size=10m --log-opt max-file=5 $image"
    Write-Host "  sudo docker ps -a"
}
finally {
    Pop-Location
}
