import type { PlatformConfiguration } from "../types";
export const initialPlatformConfiguration: PlatformConfiguration = {
  id: 1,
  platformName: "OneCloud Platform",
  platformUrl: "https://onecloud.example.com",
  defaultTimeZone: "UTC +05:30",
  defaultLanguage: "English",
  smtp: {
    host: "smtp.example.com",
    port: 587,
    username: "admin@example.com",
    password: "********",
    configured: true,
  },
  smsGateway: {
    provider: "Twilio",
    endpoint: "https://sms.example.com",
    apiKey: "********",
    configured: true,
  },
  apiGateway: {
    baseUrl: "https://api.example.com",
    timeout: 30,
    configured: true,
  },
  version: 1,
  lastModified: "01 Sep 2026",
  modifiedBy: "Super Admin",
};
