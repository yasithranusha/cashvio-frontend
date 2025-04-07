import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="bg-radial to-background absolute inset-0 from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  iconProps?: React.ComponentProps<LucideIcon>;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  className,
  iconProps = { className: "size-6", "aria-hidden": true },
}: FeatureCardProps) => {
  return (
    <Card className={`group shadow-zinc-950/5 ${className || ""}`}>
      <CardHeader className="pb-3">
        <CardDecorator>
          <Icon {...iconProps} />
        </CardDecorator>

        <h3 className="mt-6 font-medium">{title}</h3>
      </CardHeader>

      <CardContent>
        <p className="mt-3 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};
