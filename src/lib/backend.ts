type BackendConfig = {
  baseUrl: string;
};

export function getBackendConfig(): BackendConfig {
  const baseUrl = process.env.BACKEND_BASE_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_BASE_URL is not set");
  }

  return { baseUrl };
}

export async function backendFetch(path: string, init: RequestInit & { json?: unknown } = {}) {
  const { baseUrl } = getBackendConfig();

  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(init.headers);

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
