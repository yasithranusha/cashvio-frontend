import { Button } from "@workspace/ui/components/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { freePlan, proPlan } from "@/data/features";

export default function PricingSection() {
  return (
    <section id="pricing" >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">
            Pricing that Scales with Your Business
          </h1>
          <p className="text-muted-foreground">
            Our flexible pricing options are designed to accommodate businesses
            of all sizes, from small shops to growing enterprises. Start with
            our feature-rich free plan and upgrade as your business expands.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
          <div className="rounded-(--radius) border p-6 md:col-span-3 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">{freePlan.name}</h2>
                  <span className="my-3 block text-2xl font-semibold">
                    {freePlan.price}
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {freePlan.description}
                  </p>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link href={proPlan.href}>{freePlan.buttonText}</Link>
                </Button>
              </div>

              <div>
                <div className="text-sm font-medium">Included features:</div>

                <ul className="mt-4 list-outside space-y-3 text-sm">
                  {freePlan.features.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="dark:bg-muted rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 shadow-lg shadow-gray-950/5 md:col-span-2 lg:p-10 dark:[--color-muted:var(--color-zinc-900)] relative">
            <div className="absolute -top-3 right-6 md:right-10">
              <Badge
                variant="outline"
                className="bg-background border-primary text-primary"
              >
                Coming Soon
              </Badge>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="font-medium">{proPlan.name}</h2>
                <span className="my-3 block text-2xl font-semibold">
                  {proPlan.price}
                </span>
                <p className="text-muted-foreground text-sm">
                  {proPlan.description}
                </p>
              </div>

              <Button asChild className="w-full" disabled>
                <Link href={proPlan.href}>{proPlan.buttonText}</Link>
              </Button>

              <hr className="border-dashed" />

              <div className="text-sm font-medium">
                Everything in free plus:
              </div>

              <ul className="list-outside space-y-3 text-sm">
                {proPlan.features.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="size-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
