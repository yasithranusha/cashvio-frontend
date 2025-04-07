import { testimonials } from "@/data/testimonials";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Card, CardContent } from "@workspace/ui/components/card";

export default function TestimonialsSection() {
  return (
    <section id="customers">
      <div>
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-4xl font-semibold">
              Trusted by Small Businesses
            </h2>
            <p className="text-muted-foreground mt-4 mx-auto max-w-2xl">
              See how businesses like yours are growing with easier financial
              management and actionable insights.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(({ name, business, quote, image }, index) => (
              <Card key={index} className="border shadow-sm">
                <CardContent className="grid grid-cols-[auto_1fr] gap-4 p-6">
                  <Avatar className="size-10">
                    <AvatarImage
                      alt={name}
                      src={image}
                      loading="lazy"
                      width="120"
                      height="120"
                    />
                    <AvatarFallback>
                      {name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="font-medium">{name}</h3>
                    <span className="text-muted-foreground block text-sm">
                      {business}
                    </span>

                    <blockquote className="mt-3">
                      <p className="text-sm">{quote}</p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
