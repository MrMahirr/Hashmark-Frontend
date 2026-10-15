import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/shared/auth/session";

/**
 * Korunan sayfalar (/dashboard/**) için sunucu tarafı ilk savunma hattı.
 *
 * Oturum işareti çerezi yoksa kullanıcı, korunan içerik render edilmeden login'e yönlendirilir;
 * böylece istemci tarafı guard'ın (useAuthGuard) yol açtığı "içerik flaşı" yaşanmaz.
 * Gerçek yetkilendirme backend'de JWT ile yapılır; bkz. `shared/auth/session.ts`.
 */
export function proxy(request: NextRequest) {
  if (request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
