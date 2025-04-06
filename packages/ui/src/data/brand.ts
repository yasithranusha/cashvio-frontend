export const BRAND = {
  name: "Cashvio",
  productName: "Cashvio",
  contactMail: "support@cashvio.com",
  url: "cashvio.com",
  productDescription: "A POSS help you to manage your cash flow",
  socialmedia: {
    facebook: "https://www.facebook.com/abc",
    twitter: "https://www.twitter.com/abc",
    linkedin: "https://www.linkedin.com/abc",
    instagram: "https://www.instagram.com/abc",
  },
  logo: "https://cashvio.s3.eu-north-1.amazonaws.com/assets/logo-full.png",
  mobilelogo:
    "https://cashvio.s3.eu-north-1.amazonaws.com/assets/logo.png",
} as const;

export const DevelopedBy = {
  name: "Yasith Ranusha",
  url: "https://www.github.com/yasithranusha",
} as const;

export type BrandType = typeof BRAND;
export type DevelopedByType = typeof DevelopedBy;
