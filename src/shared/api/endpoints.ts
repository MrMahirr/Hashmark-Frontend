/**
 * SRP (Single Responsibility Principle) gereği tüm alt API parçaları (endpoint suffixleri) 
 * merkezi olarak burada tutulur. Backend'in sunduğu controller metodlarına %100 uyumludur.
 */
export enum ApiEndpoint {
  // Auth
  GITHUB = "github",
  CALLBACK = "callback",
  REFRESH = "refresh",
  LOGOUT = "logout",

  // Repos
  SYNC = "sync",

  // Debts
  STATS = "stats",

  // Scanner
  STATUS = "status",

  // Report
  SUMMARY = "summary",
  SEND_TEST = "send-test",
}
