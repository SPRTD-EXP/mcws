import Nav from "@/components/nav";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1">
        <HeroSection />
        <CommunityTeaser />
      </main>
      <Footer />
    </>
  );
}

function CommunityTeaser() {
  return (
    <section className="px-6 py-24 md:px-12 md:py-32 pattern-overlay bg-[#f5f5f5]">
      <div className="max-w-2xl mx-auto text-center">
        <p
          className="text-[#6b6b6b] text-xs tracking-[0.3em] uppercase mb-6"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Muslim Community of the Western Suburbs
        </p>
        <h2
          className="text-4xl md:text-5xl font-light leading-tight mb-8 text-[#0a0a0a]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Faith, Community,{" "}
          <span className="italic text-[#8ecfb5]">Identity.</span>
        </h2>
        <p
          className="text-[#6b6b6b] text-sm leading-7 mb-10 max-w-lg mx-auto"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          MCWS is a community rooted in faith, service, and belonging in the
          heart of metropolitan Detroit. This hoodie represents more than
          clothing — it is a declaration of who we are.
        </p>
        <a
          href="/about"
          className="text-xs tracking-[0.2em] uppercase text-[#8ecfb5] hover:text-[#0a0a0a] transition-colors duration-200 border-b border-[#8ecfb5] hover:border-[#0a0a0a] pb-0.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Our Story
        </a>
      </div>
    </section>
  );
}
