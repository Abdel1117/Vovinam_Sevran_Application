import Header from "@/components/Header/Header";
import Loader from "@/components/Loader/Loader";

export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-hero-vovinam px-7 pt-40 pb-16" />
        <Loader className="min-h-[40vh] px-6 py-20" />
      </main>
    </>
  );
}
