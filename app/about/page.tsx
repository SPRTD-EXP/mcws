import Nav from "@/components/nav";
import Footer from "@/components/footer";
import GeometricDivider from "@/components/geometric-divider";

export const metadata = {
  title: "About — MCWS",
  description: "The story and mission of the Muslim Community of the Western Suburbs of Detroit.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-2xl mx-auto w-full">
          <p
            className="text-white text-[10px] tracking-[0.4em] uppercase mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Our Story
          </p>
          <h1
            className="text-5xl md:text-6xl font-light leading-tight text-white mb-16"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Muslim Community of the Western Suburbs
          </h1>

          <div className="space-y-16">
            <section>
              <h2
                className="text-2xl font-light text-white mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who We Are
              </h2>
              <div
                className="text-white/60 text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  MCWS is a Muslim community rooted in faith, service, and belonging in the heart of metropolitan Detroit. We are neighbors, families, and friends united by a shared commitment to our deen and to one another.
                </p>
                <p>
                  Founded to serve the growing Muslim population of the western suburbs, our community has grown into a vibrant center of worship, education, and mutual support — a home for Muslims of all backgrounds.
                </p>
              </div>
            </section>

            <GeometricDivider />

            <section>
              <h2
                className="text-2xl font-light text-white mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our Mission
              </h2>
              <div
                className="text-white/60 text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  We strive to strengthen the spiritual, social, and civic lives of Muslims in the western suburbs of Detroit — providing a welcoming space for prayer, learning, and community connection.
                </p>
                <p>
                  From Friday Jumu&apos;ah to youth programs, community iftars to charitable initiatives, MCWS exists to serve its members and the broader community with integrity and compassion.
                </p>
              </div>
            </section>

            <GeometricDivider />

            <section>
              <h2
                className="text-2xl font-light text-white mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                The Hoodie
              </h2>
              <div
                className="text-white/60 text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  This hoodie is more than clothing — it is a declaration of identity. Wearing MCWS means carrying your community with you, a visible expression of faith and belonging wherever you go.
                </p>
                <p>
                  Made to order, each piece is crafted with care. Proceeds support the ongoing work of our community.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
