/** GET /public/consent-policy ve /public/private-repo-notice */
export interface ConsentPolicy {
  version: number;
  language: string;
  /** "## Başlık" ve "- madde" satırlarından oluşan düz metin */
  text: string;
  /** Metnin SHA-256'sı; onayda aynen geri gönderilir */
  hash: string;
}

/** GET/POST/DELETE /user/consent */
export interface ConsentStatus {
  enforced: boolean;
  required: boolean;
  currentVersion: number;
  acceptedVersion: number | null;
  acceptedAt: string | null;
}
