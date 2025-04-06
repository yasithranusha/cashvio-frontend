import { BarChart3, BadgePercent, CreditCard } from "lucide-react";

export const features = [
  {
    icon: BarChart3,
    title: "Cashflow Analytics",
    description:
      "Gain valuable insights into your business's financial health with comprehensive cashflow analysis and visualization tools.",
  },
  {
    icon: CreditCard,
    title: "Seamless Transactions",
    description:
      "Process sales quickly and efficiently with an intuitive interface designed for speed and accuracy at the point of sale.",
  },
  {
    icon: BadgePercent,
    title: "Customer Loyalty Program",
    description:
      "Build customer retention with a powerful loyalty program that offers rewards, points tracking, and personalized promotions.",
  },
];

export const freePlan = {
  name: "Free",
  price: "$0 / mo",
  description: "Perfect for small businesses",
  href: "/register",
  buttonText: "Get Started",
  features: [
    "Basic POS System",
    "Inventory Tracking",
    "Customer Management",
    "Employee Management",

    "Sales Analytics Dashboard",
    "Payment Reminders & Scheduling",
    "Basic Sales Reports",
    "Role-Based Access Control",
    "Email Support",
  ],
};

export const proPlan = {
  name: "Pro",
  price: "$29 / mo",
  description: "For growing businesses",
  href: "#",
  buttonText: "Join Waitlist",
  comingSoon: true,
  features: [
    "Advanced Cashflow Analytics",
    "Customer Loyalty Program",
    "Multiple Branch Management",
    "Advanced Sales Reports",
    "API Access to build your E-commerce",
    "Multi-Currency Support",
    "Advanced Inventory Management",
    "Priority Support",
  ],
};
