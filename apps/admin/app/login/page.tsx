import Image from "next/image";

import { LoginForm } from "@workspace/ui/components/auth/login-form";
import { BRAND } from "@workspace/ui/data/brand";
import { login } from "@/actions/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-radial-[at_25%_25%] from-foreground/90 from-5% via-muted/80 via-70% to-background to-90% p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center  self-center font-medium">
          <Image
            src={BRAND.logo}
            alt={`${BRAND.name} Logo`}
            width={120}
            height={120}
          />
        </div>
        <LoginForm onSubmit={login} successRedirect="/dashboard" />
      </div>
    </div>
  );
}
