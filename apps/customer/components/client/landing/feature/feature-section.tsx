"use client";

import { features } from "@/data/features";
import { FeatureCard } from "@/components/client/landing/feature/feature-card";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-zinc-50 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
          Made for Shoppers Who Want to Stay in Control
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            All your purchases info, rewards and warranties always up to date and easy to find.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}