import { QueryClient, QueryFunction } from "@tanstack/react-query";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

function withBaseUrl(url: string): string {
  if (!url) return url;
  // If url is absolute (http/https), leave it as is
  if (/^https?:\/\//i.test(url)) return url;
  // If url is relative and starts with '/', prefix backend base URL
  if (url.startsWith("/")) {
    // Avoid double slashes when concatenating
    const base = BACKEND_BASE_URL.replace(/\/$/, "");
    return `${base}${url}`;
  }
  return url;
}

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  return {};
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function parseResponseBody(res: Response) {
  if (res.status === 204) {
    return null;
  }

  const contentLength = res.headers.get("content-length");
  if (contentLength === "0") {
    return null;
  }

  return res.json();
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  const res = await fetch(withBaseUrl(url), {
    method,
    headers: {
      ...getAuthHeaders(),
      ...(data ? { "Content-Type": "application/json" } : {}),
    } as HeadersInit,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return parseResponseBody(res);
}

export async function uploadFile(
  url: string,
  file: File,
  additionalData?: Record<string, string>,
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const requestUrl = withBaseUrl(url);

  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let abortHandler: (() => void) | null = null;

    xhr.open("POST", requestUrl, true);
    xhr.withCredentials = true;

    const authHeaders = getAuthHeaders() as Record<string, string>;
    Object.entries(authHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading file"));
    };

    xhr.onabort = () => {
      const abortError = new Error("Upload canceled");
      (abortError as Error & { name: string }).name = "AbortError";
      reject(abortError);
    };

    xhr.onload = async () => {
      try {
        const responseText = xhr.responseText || "";
        const response = responseText ? JSON.parse(responseText) : null;

        if (xhr.status < 200 || xhr.status >= 300) {
          const errorMessage =
            response?.message || response?.error || xhr.statusText || "Upload failed";
          reject(new Error(`${xhr.status}: ${errorMessage}`));
          return;
        }

        if (onProgress) {
          onProgress(100);
        }

        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        if (abortHandler && abortSignal) {
          abortSignal.removeEventListener("abort", abortHandler);
        }
      }
    };

    if (abortSignal) {
      abortHandler = () => xhr.abort();
      if (abortSignal.aborted) {
        xhr.abort();
        return;
      }
      abortSignal.addEventListener("abort", abortHandler, { once: true });
    }

    xhr.send(formData);
  });
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const res = await fetch(withBaseUrl(queryKey.join("/") as string), {
        headers: getAuthHeaders() as HeadersInit, // Add auth headers
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
