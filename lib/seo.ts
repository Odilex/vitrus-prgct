import type { Metadata } from "next";

// Shared SEO constants for reuse across the site
export const SITE_NAME = "Vitrus";
export const SITE_URL = "https://vitrus.rw";
export const DEFAULT_TITLE = "Vitrus Rwanda | 360° Virtual Tours for Properties & Spaces";
export const DEFAULT_DESCRIPTION =
  "See it before you book it. Vitrus Rwanda creates immersive virtual tours for Airbnbs, workspaces, and businesses across Rwanda.";
export const OG_IMAGE = "/og-image.png";

export const baseMetadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Vitrus Virtual Tours",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
};
