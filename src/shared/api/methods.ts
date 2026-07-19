/**
 * SRP (Single Responsibility Principle) gereği, uygulamanın kullandığı tüm API base path'lerini
 * tek bir merkezi enum üzerinden yönetiyoruz. Backend Controller'ları ile birebir eşleşir.
 */
export enum ApiMethod {
  AUTH = "/auth",
  REPOS = "/repos",
  DEBTS = "/debts",
  SCAN = "/scan",
  SETTINGS = "/settings",
  REPORT = "/report",
}
