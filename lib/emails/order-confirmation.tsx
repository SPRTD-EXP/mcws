import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

const SITE_URL = "https://mcws-shop.vercel.app";
import * as React from "react";

export interface OrderConfirmationProps {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  items: { name: string; size: string; quantity: number; price_cents: number }[];
  fulfillmentMethod: "shipping";
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
  } | null;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export default function OrderConfirmationEmail({
  orderNumber = 1001,
  customerName = "Adam Hage",
  items = [{ name: "MCWS Embroidered Hoodie", size: "M", quantity: 1, price_cents: 6500 }],
  fulfillmentMethod = "shipping",
  shippingAddress = { line1: "123 Main St", city: "Canton", state: "MI", postal_code: "48187" },
  subtotalCents = 6500,
  taxCents = 390,
  totalCents = 6890,
}: OrderConfirmationProps) {
  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const orderDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const previewText = `Order #${orderNumber} confirmed — MCWS`;

  return (
    <Html>
      <Head>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap');`}
        </style>
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={`${SITE_URL}/logo-white.svg`}
              width="40"
              height="40"
              alt="MCWS"
              style={{ display: "block", margin: "0 auto" }}
            />
          </Section>

          <Hr style={divider} />

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroHeading}>Order Confirmed</Heading>
            <Text style={heroSubtext}>
              Thank you, {customerName}. Your order has been received and is being prepared.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Order meta */}
          <Section style={orderDetailsSection}>
            <Row>
              <Column style={orderMetaColumn}>
                <Text style={metaLabel}>Order</Text>
                <Text style={metaValue}>#{orderNumber}</Text>
              </Column>
              <Column style={orderMetaColumn}>
                <Text style={metaLabel}>Date</Text>
                <Text style={metaValue}>{orderDate}</Text>
              </Column>
              <Column style={orderMetaColumn}>
                <Text style={metaLabel}>Method</Text>
                <Text style={metaValue}>Shipping</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={productSection}>
            <Text style={sectionHeading}>Items</Text>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: "12px" }}>
                <Column style={{ verticalAlign: "top" }}>
                  <Text style={productCategory}>Hoodie</Text>
                  <Text style={productNameText}>{item.name}</Text>
                  <Text style={productDetail}>Size: {item.size}</Text>
                  <Text style={productDetail}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={{ verticalAlign: "top", textAlign: "right" as const }}>
                  <Text style={productPrice}>{fmt(item.price_cents * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={totalSection}>
            <Row>
              <Column><Text style={totalLabel}>Subtotal</Text></Column>
              <Column><Text style={{ ...totalValue, fontSize: "14px" }}>{fmt(subtotalCents)}</Text></Column>
            </Row>
            {taxCents > 0 && (
              <Row>
                <Column><Text style={totalLabel}>Tax</Text></Column>
                <Column><Text style={{ ...totalValue, fontSize: "14px" }}>{fmt(taxCents)}</Text></Column>
              </Row>
            )}
            <Row>
              <Column>
                <Text style={{ ...totalLabel, color: "#ffffff" }}>Total</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{fmt(totalCents)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={divider} />

          {/* Fulfillment */}
          <Section style={fulfillmentSection}>
            <Text style={sectionHeading}>Shipping To</Text>
            {shippingAddress && (
              <>
                <Text style={addressText}>{shippingAddress.line1}</Text>
                {shippingAddress.line2 && (
                  <Text style={addressText}>{shippingAddress.line2}</Text>
                )}
                <Text style={addressText}>
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                </Text>
              </>
            )}
            <Text style={timelineText}>
              Made to order — ships within 2–3 weeks. You&apos;ll receive tracking info once your order ships.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>
              Muslim Community of the Western Suburbs · Detroit
            </Text>
            <Text style={footerNote}>
              Questions about your order? Reply to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ─── Styles ──────────────────────────────────────────────

const main: React.CSSProperties = {
  backgroundColor: "#000000",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  color: "#ffffff",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "40px 24px",
  maxWidth: "600px",
};

const header: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "0 0 24px 0",
};


const divider: React.CSSProperties = {
  borderColor: "#222222",
  borderWidth: "1px",
  borderStyle: "solid",
  margin: "0",
};

const heroSection: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "40px 0",
};

const heroHeading: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
  fontSize: "28px",
  fontWeight: 400,
  letterSpacing: "4px",
  color: "#ffffff",
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
};

const heroSubtext: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "14px",
  fontWeight: 300,
  lineHeight: "22px",
  color: "#999999",
  margin: "0",
};

const orderDetailsSection: React.CSSProperties = {
  padding: "24px 0",
};

const orderMetaColumn: React.CSSProperties = {
  textAlign: "center" as const,
  width: "33.33%",
};

const metaLabel: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "3px",
  textTransform: "uppercase" as const,
  color: "#666666",
  margin: "0 0 6px 0",
};

const metaValue: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  color: "#ffffff",
  margin: "0",
};

const productSection: React.CSSProperties = {
  padding: "32px 0",
};

const productCategory: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: "#666666",
  margin: "0 0 8px 0",
};

const productNameText: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
  fontSize: "18px",
  fontWeight: 400,
  color: "#ffffff",
  margin: "0 0 12px 0",
};

const productDetail: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 300,
  color: "#999999",
  margin: "0 0 4px 0",
};

const productPrice: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "16px",
  fontWeight: 400,
  color: "#ffffff",
  margin: "0",
};

const sectionHeading: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: "#666666",
  margin: "0 0 14px 0",
};

const fulfillmentSection: React.CSSProperties = {
  padding: "28px 0",
};

const addressText: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "14px",
  fontWeight: 300,
  color: "#ffffff",
  margin: "0 0 2px 0",
  lineHeight: "20px",
};

const timelineText: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "13px",
  fontWeight: 300,
  color: "#666666",
  margin: "16px 0 0 0",
  lineHeight: "20px",
  fontStyle: "italic" as const,
};

const totalSection: React.CSSProperties = {
  padding: "24px 0",
};

const totalLabel: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "10px",
  fontWeight: 400,
  letterSpacing: "4px",
  textTransform: "uppercase" as const,
  color: "#666666",
  margin: "0 0 8px 0",
};

const totalValue: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "18px",
  fontWeight: 400,
  color: "#ffffff",
  margin: "0 0 8px 0",
  textAlign: "right" as const,
};

const footer: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "32px 0 0 0",
};

const footerBrand: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', 'Times New Roman', serif",
  fontSize: "13px",
  fontWeight: 400,
  letterSpacing: "2px",
  color: "#444444",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
};

const footerNote: React.CSSProperties = {
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  fontSize: "12px",
  fontWeight: 300,
  color: "#444444",
  margin: "0",
};
