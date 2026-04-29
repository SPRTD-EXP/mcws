import Nav from "@/components/nav";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import EmailSignup from "@/components/email-signup";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1">
        <HeroSection />
        <EmailSignup />
      </main>
      <Footer />
    </>
  );
}
