/**
 * Oturum "var" işareti çerezi.
 *
 * Token'lar localStorage'da tutulur ve sunucu tarafından okunamaz. Next.js proxy'si
 * (`src/proxy.ts`) korunan sayfalarda içerik daha render edilmeden, giriş yapmamış kullanıcıyı
 * login'e yönlendirebilsin diye bu içeriksiz işaret çerezi tutulur.
 *
 * ÖNEMLİ: Bu bir güvenlik sınırı DEĞİLDİR (istemci tarafından yazılabilir). Yetkilendirmenin
 * asıl denetimi backend API'sindeki JWT doğrulamasıdır; çerez yalnızca yönlendirme/UX içindir.
 */
export const SESSION_COOKIE = "hm_session";

/** Refresh token ömrüyle uyumlu (7 gün). */
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export function setSessionCookie(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearSessionCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
