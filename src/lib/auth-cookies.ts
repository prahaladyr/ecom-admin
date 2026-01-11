export const ACCESS_TOKEN_COOKIE = "ecom_access_token";
export const REFRESH_TOKEN_COOKIE = "ecom_refresh_token";

export function isProduction() {
  return process.env.NODE_ENV === "production";
}
