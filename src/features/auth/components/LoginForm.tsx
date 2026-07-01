import Link from "next/link";
import { Button } from "@/shared/components";
import { ArrowLeft } from "lucide-react";

const GithubIcon = () => (
  <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48C19.137 20.107 22 16.373 22 11.969 22 6.463 17.522 2 12 2z"
    ></path>
  </svg>
);

export function LoginForm() {
  return (
    <div className="bg-hm-surface w-full max-w-[400px] rounded-card border-thin border-hm-border p-12 relative">
      {/* Back Button */}
      <Link 
        href="/" 
        aria-label="Ana Sayfaya Dön"
        className="absolute top-6 left-6 flex items-center justify-center p-1.5 rounded-control text-hm-text-secondary hover:text-hm-text-primary hover:bg-hm-border-light transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </Link>

      {/* Brand / Header */}
      <div className="flex flex-col items-center mb-4 gap-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-[32px] font-medium leading-none text-hm-text-primary">
            #
          </span>
          <span className="text-[15px] font-medium text-hm-text-primary">
            Hashmark
          </span>
        </div>
        <h1 className="text-[20px] font-medium text-hm-text-primary">
          Giriş yap
        </h1>
        <p className="text-[13px] text-hm-text-secondary text-center mt-1">
          Borç takibine başlamak için GitHub hesabınızı bağlayın.
        </p>
      </div>

      {/* Action Area */}
      <div className="mt-8 flex flex-col gap-4">
        {/* GitHub Login Button (Custom dark grey styling from design) */}
        <button className="w-full h-[44px] bg-[#24292F] hover:bg-[#24292F]/90 text-white font-medium text-[14px] rounded-control flex items-center justify-center gap-3 transition-colors">
          <GithubIcon />
          GitHub ile Devam Et
        </button>
      </div>

      {/* Fine Print */}
      <div className="mt-8 text-center">
        <p className="text-[11px] font-medium text-hm-text-secondary/70">
          Giriş yaparak{" "}
          <Link
            href="#"
            className="hover:text-hm-text-primary transition-colors underline underline-offset-2"
          >
            Hizmet Şartlarımızı
          </Link>{" "}
          ve{" "}
          <Link
            href="#"
            className="hover:text-hm-text-primary transition-colors underline underline-offset-2"
          >
            Gizlilik Politikamızı
          </Link>{" "}
          kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
