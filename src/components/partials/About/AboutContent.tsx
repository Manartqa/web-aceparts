import Image from "next/image";
import { CtaBanner, PageHero, SectionHeading } from "@/components/common";
import { aboutPage } from "@/content";

export default function AboutContent() {
  const { vision } = aboutPage;

  return (
    <>
      <PageHero title="About Us" eyebrow={aboutPage.tagline} breadcrumbs={[{ label: "About Us" }]} />

      <section className="py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={aboutPage.eyebrow} title={aboutPage.title} />
            <div className="mt-8 space-y-5 text-lg leading-relaxed">
              {aboutPage.story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-brand/20">
            <Image src={aboutPage.storyImage} alt="Railway engineering" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-brand-soft/60 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow={aboutPage.objectiveEyebrow} title={aboutPage.objectiveTitle} align="center" />

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-80 overflow-hidden rounded-3xl">
              <Image src={aboutPage.visionImage} alt="Train arriving on a jungle railway line" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            </div>

            <div className="flex flex-col gap-8">
              <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-brand/5 lg:p-10">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent-ink">Our Vision</h3>
                <blockquote className="mt-4 leading-relaxed">“{vision.text}”</blockquote>
                <p className="mt-6 font-display font-bold text-ink">{vision.author}</p>
                <p className="text-sm">{vision.role}</p>
              </article>

              <article className="rounded-3xl bg-brand p-8 text-white lg:p-10">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-accent">Our Mission</h3>
                <p className="mt-4 font-display text-xl font-semibold leading-snug">{aboutPage.mission}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
