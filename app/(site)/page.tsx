import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { getContent } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function Home() {
  const c = await getContent();
  return (
    <>
      <Hero
        site={c.site}
        typingPhrases={c.typingPhrases}
      />
      <About about={c.about} />
      <Skills skillGroups={c.skillGroups} />
      <Education education={c.education} />
      <Projects projects={c.projects} />
      <Contact site={c.site} />
    </>
  );
}
