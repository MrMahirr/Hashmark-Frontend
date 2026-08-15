export interface NotificationResponse {
  id: number;
  title: string;
  description: string;
  type: "SUCCESS" | "WARNING" | "INFO" | "ERROR";
  read: boolean;
  createdAt: string;
}
