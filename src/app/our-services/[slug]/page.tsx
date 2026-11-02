import { notFound } from "next/navigation";
import { JsonLd } from "@/components/common";
import { ServiceDetail } from "@/components/partials/Services";
import { getService, services } from "@/content";
import { serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

// Every slug is prerendered below, so navigating here only waits for a static
// payload; skip the instant-navigation check that wants a <Suspense> shell.
export const instant = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/our-services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: service.href,
    image: service.photo,
  });
}

export default async function ServicePage({ params }: PageProps<"/our-services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <ServiceDetail service={service} />
    </>
  );
}
