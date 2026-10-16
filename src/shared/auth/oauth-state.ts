const KEY = "oauthState";

/** GitHub yönlendirme adresindeki `state` değerini bu tarayıcıya bağlar (login CSRF koruması). */
export function rememberOAuthState(authUrl: string): void {
  try {
    const state = new URL(authUrl).searchParams.get("state");
    if (state) sessionStorage.setItem(KEY, state);
  } catch {
    // geçersiz URL veya engellenmiş depolama: callback doğrulaması başarısız olur
  }
}

/**
 * Callback'te gelen state, bu tarayıcıda başlatılan girişteki state ile eşleşiyorsa true döner.
 * Değer tek kullanımlıktır; her durumda silinir.
 */
export function consumeOAuthState(returned: string | null): boolean {
  try {
    const expected = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return !!returned && !!expected && returned === expected;
  } catch {
    return false;
  }
}
