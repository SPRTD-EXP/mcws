import Nav from "@/components/nav";
import Footer from "@/components/footer";

export const metadata = {
  title: "About — MCWS",
  description: "The story and mission of the Muslim Community of the Western Suburbs of Detroit.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-20 pb-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p
              className="text-white text-[10px] tracking-[0.4em] uppercase mb-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Our Story
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            <section className="bg-black p-8 md:p-10 text-center">
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
                  MCWS is the Muslim Community of the Western Suburbs of Detroit. We are neighbors, families, and friends who found in each other what makes a place feel like home.
                </p>
                <p>
                  What has been built here is not just a masjid. It is a community that shows up, whether that is for prayer, for learning, and for one another.
                </p>
              </div>
            </section>

            <section className="bg-black p-8 md:p-10 text-center">
              <h2
                className="text-2xl font-light text-white mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Represent the Community
              </h2>
              <div
                className="text-white/60 text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  This clothing line exists because the community wanted a way to be seen beyond the walls of the masjid. At school, at work, out in the world. The MCWS name on your chest is recognition for those who know it and an introduction for those who do not.
                </p>
                <p>
                  Wearing MCWS means carrying something with you. A community, a faith, a home.
                </p>
              </div>
            </section>

            <section className="bg-black p-8 md:p-10 text-center">
              <h2
                className="text-2xl font-light text-white mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Every Purchase Goes Back
              </h2>
              <div
                className="text-white/60 text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                   A portion of proceeds will go directly back into MCWS youth programs and initiatives.
                </p>
                <p>
                  These allocated funds will go into social events, Islamic education, and leadership development. The youth in this community deserve a place built for them. Every purchase helps make that possible.
                </p>
              </div>
            </section>
          </div>

          <div className="mt-16">
            <a
              href="https://mcws.org"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase text-center hover:bg-white hover:text-black transition-colors duration-200"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Learn More
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
