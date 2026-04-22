import Nav from "@/components/nav";
import Footer from "@/components/footer";
import GeometricDivider from "@/components/geometric-divider";

export const metadata = {
  title: "Policies — MCWS",
  description: "Shipping, returns, and privacy policy for the MCWS merch store.",
};

export default function PoliciesPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-2xl mx-auto w-full">
          <p
            className="text-[#999] text-[10px] tracking-[0.4em] uppercase mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Store Policies
          </p>
          <h1
            className="text-5xl md:text-6xl font-light leading-tight text-white mb-16"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Policies
          </h1>

          <div className="space-y-16">
            {/* Shipping */}
            <section>
              <h2
                className="text-2xl font-light text-[#8ecfb5] mb-5 text-center"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Shipping Policy
              </h2>
              <div
                className="text-[#999] text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  All orders are made to order. Please allow <strong className="text-white">1 week</strong> for
                  production and fulfillment before your order ships.
                </p>
                <p>
                  We currently ship within the <strong className="text-white">United States</strong> only.
                  Shipping costs are calculated at checkout based on your address.
                </p>
                <p>
                  Once shipped, you will receive a tracking number via email.
                  MCWS is not responsible for delays caused by carriers once
                  the package has been handed off.
                </p>
                <p>
                  For local pickup orders, you will be notified by email when
                  your order is ready. Pickup is available at the mosque
                  address provided upon order confirmation.
                </p>
              </div>
            </section>

            <GeometricDivider />

            {/* Returns */}
            <section>
              <h2
                className="text-2xl font-light text-[#8ecfb5] mb-5 text-center"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Return & Refund Policy
              </h2>
              <div
                className="text-[#999] text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  Because every item is <strong className="text-white">made to order</strong>, we do not
                  accept returns or exchanges unless the item arrives damaged or
                  defective.
                </p>
                <p>
                  If your order arrives with a defect or error on our part,
                  please contact us within <strong className="text-white">7 days</strong> of delivery at{" "}
                  <a
                    href="mailto:info@mcws.org"
                    className="text-[#8ecfb5] hover:text-white transition-colors"
                  >
                    info@mcws.org
                  </a>{" "}
                  with a photo of the issue and your order number. We will make
                  it right.
                </p>
                <p>
                  We are unable to accommodate size exchanges once an order has
                  entered production. Please select your size carefully.
                </p>
              </div>
            </section>

            <GeometricDivider />

            {/* Privacy */}
            <section>
              <h2
                className="text-2xl font-light text-[#8ecfb5] mb-5 text-center"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Privacy Policy
              </h2>
              <div
                className="text-[#999] text-sm leading-7 space-y-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                <p>
                  We collect only the information necessary to process your
                  order: your name, email address, and shipping address (if
                  applicable). This information is used solely for fulfillment
                  and order communication.
                </p>
                <p>
                  Payment is processed securely by{" "}
                  <strong className="text-white">Stripe</strong>. We never
                  store your card details on our servers.
                </p>
                <p>
                  We do not sell, rent, or share your personal information with
                  third parties for marketing purposes.
                </p>
                <p>
                  For any privacy-related questions, contact us at{" "}
                  <a
                    href="mailto:info@mcws.org"
                    className="text-[#8ecfb5] hover:text-white transition-colors"
                  >
                    info@mcws.org
                  </a>
                  .
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
