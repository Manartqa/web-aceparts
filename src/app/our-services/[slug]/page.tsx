import { notFound } from "next/navigation";
import { ServiceDetail } from "@/components/partials/Services";
import { getService, services } from "@/content";

// Every slug is prerendered below, so navigating here only waits for a static
// payload; skip the instant-navigation check that wants a <Suspense> shell.
export const instant = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}

export default async function ServicePage({ params }: PageProps<"/our-services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
