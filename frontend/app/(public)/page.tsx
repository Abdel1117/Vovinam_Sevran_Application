import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Featured from "@/components/Featured/Featured";
import About from "@/components/About/About";
import Values from "@/components/Values/Values";
import Courses from "@/components/Courses/Courses";
import News from "@/components/News/News";
import Agenda from "@/components/Agenda/Agenda";
import GalleryTeaser from "@/components/GalleryTeaser/GalleryTeaser";
import Stats from "@/components/Stats/Stats";
import Teachers from "@/components/Teachers/Teachers";
import CtaFinal from "@/components/CtaFinal/CtaFinal";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Featured />
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
