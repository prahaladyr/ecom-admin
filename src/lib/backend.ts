type BackendConfig = {
  baseUrl: string;
  tenantApiKey: string;
};

export function getBackendConfig(): BackendConfig {
  const baseUrl = process.env.BACKEND_BASE_URL;
  const tenantApiKey = process.env.TENANT_API_KEY;

  if (!baseUrl) {
    throw new Error("BACKEND_BASE_URL is not set");
  }
  if (!tenantApiKey) {
    throw new Error("TENANT_API_KEY is not set");
  }

  return { baseUrl, tenantApiKey };
}

export async function backendFetch(path: string, init: RequestInit & { json?: unknown } = {}) {
  const { baseUrl, tenantApiKey } = getBackendConfig();

  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(init.headers);
  headers.set("x-api-key", tenantApiKey);

  let body = init.body;
  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.json);
  }

  return fetch(url, {
    ...init,
    headers,
    body,
    cache: "no-store",
  });
}
