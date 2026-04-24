import Nav from "@/components/nav";
import Footer from "@/components/footer";
import GeometricDivider from "@/components/geometric-divider";

export const metadata = {
  title: "About — MCWS",
  description:
    "The Muslim Community of the Western Suburbs of Detroit — our story, mission, and what this community represents.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-28 pb-16 px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto w-full mb-20 text-center">
          <h1
            className="text-5xl md:text-7xl font-light leading-tight text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Muslim Community
            <br />
            <span className="italic text-[#8ecfb5]">of the Western Suburbs</span>
          </h1>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#e5e7eb] mb-20" />

        {/* Story */}
        <div className="max-w-2xl mx-auto w-full space-y-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p
                className="text-[10px] tracking-[0.3em] uppercase text-[#8ecfb5] mb-5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Our Community
              </p>
              <h2
                className="text-3xl font-light leading-snug text-[#0a0a0a] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Rooted in faith. Present in service.
              </h2>
              <p
                className="text-[#6b6b6b] text-sm leading-7"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                MCWS has served the Muslim community across the western suburbs
                of metropolitan Detroit for years — providing a place of
                worship, education, community gatherings, and spiritual
                grounding for families of all backgrounds.
              </p>
            </div>
            <div>
              <p
                className="text-[10px] tracking-[0.3em] uppercase text-[#8ecfb5] mb-5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Our Mission
              </p>
              <h2
                className="text-3xl font-light leading-snug text-[#0a0a0a] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Belonging. Dignity. Purpose.
              </h2>
              <p
                className="text-[#6b6b6b] text-sm leading-7"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                We are a community that believes in the dignity of every
                individual, the importance of shared purpose, and the power of
                coming together. Everything we do — from our programs to this
                hoodie — is an extension of that belief.
              </p>
            </div>
          </div>

          <GeometricDivider />

          {/* Merch section */}
          <div className="relative overflow-hidden bg-[#f5f5f5] p-10 md:p-14">
            <div className="relative z-10">
              <p
                className="text-[10px] tracking-[0.3em] uppercase text-[#8ecfb5] mb-5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                The Merch
              </p>
              <h2
                className="text-4xl md:text-5xl font-light italic leading-tight text-[#0a0a0a] mb-7"
                style={{ fontFamily: "var(--font-display)" }}
              >
                &ldquo;Wear your identity.&rdquo;
              </h2>
              <p
                className="text-[#6b6b6b] text-sm leading-7 max-w-lg"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                This hoodie was designed to be worn with pride — in the masjid,
                at the university, on the street. It carries the MCWS name and,
                with it, a statement of faith, belonging, and community rooted
                in the western suburbs of Detroit.
              </p>
              <div className="mt-8">
                <a
                  href="/shop"
                  className="inline-flex items-center gap-3 px-8 py-3.5 text-xs tracking-[0.25em] uppercase bg-white border border-[#8ecfb5] text-[#8ecfb5] hover:bg-[#8ecfb5] hover:text-white transition-colors duration-300"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Shop the Collection
                </a>
              </div>
            </div>
          </div>

          <GeometricDivider />

          {/* Full logo + tagline */}
          <div className="text-center py-8">
            <p
              className="text-[#6b6b6b] text-[10px] tracking-[0.3em] uppercase mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Muslim Community of the Western Suburbs of Detroit
            </p>
            <p
              className="text-6xl md:text-7xl font-light tracking-[0.2em] text-[#0a0a0a]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MCWS
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
