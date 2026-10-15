import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoginHero } from "@/features/auth/components/LoginHero";

export default function LoginPage() {
  return (
    <main id="main-content" className="flex min-h-screen flex-wrap bg-hm-bg">
      <LoginHero />
      <LoginForm />
    </main>
  );
}
