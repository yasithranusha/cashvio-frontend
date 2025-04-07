import Image from "next/image";

import { BRAND } from "@workspace/ui/data/brand";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterShopPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center  self-center font-medium">
          <Image
            src={BRAND.logo}
            alt={`${BRAND.name} Logo`}
            width={120}
            height={120}
            className="dark:invert"
          />
        </div>
        <RegisterForm redirectUrl="/dashboard"/>
      </div>
    </div>
  );
}
