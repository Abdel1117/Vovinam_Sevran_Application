import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import Featured from "@/components/site/Featured";
import About from "@/components/site/About";
import Values from "@/components/site/Values";
import Courses from "@/components/site/Courses";
import News from "@/components/site/News";
import Agenda from "@/components/site/Agenda";
import GalleryTeaser from "@/components/site/GalleryTeaser";
import Stats from "@/components/site/Stats";
import Teachers from "@/components/site/Teachers";
import CtaFinal from "@/components/site/CtaFinal";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Featured />
        <About />
        <Values />
        <Courses />
        <News />
        <Agenda />
        <GalleryTeaser />
        <Stats />
        <Teachers />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
