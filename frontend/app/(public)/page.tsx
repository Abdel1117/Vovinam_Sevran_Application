import { Suspense } from "react";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import Hero from "@/components/Hero/Hero";
import Principles from "@/components/Principles/Principles";
import About from "@/components/About/About";
import Values from "@/components/Values/Values";
import Courses from "@/components/Courses/Courses";
import News from "@/components/News/News";
import Agenda from "@/components/Agenda/Agenda";
import GalleryTeaser from "@/components/GalleryTeaser/GalleryTeaser";
import Stats from "@/components/Stats/Stats";
import Teachers from "@/components/Teachers/Teachers";
import CtaFinal from "@/components/CtaFinal/CtaFinal";
import Loader from "@/components/Loader/Loader";

const sectionLoader = <Loader className="bg-white py-20" />;

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Principles />
        <Values />
        <Courses />
        <Suspense fallback={sectionLoader}>
          <News />
        </Suspense>
        <Suspense fallback={sectionLoader}>
          <Agenda />
        </Suspense>
        <GalleryTeaser />
        <Stats />
        <Suspense fallback={sectionLoader}>
          <Teachers />
        </Suspense>
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
