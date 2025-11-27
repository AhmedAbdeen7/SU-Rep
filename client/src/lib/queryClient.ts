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
  return res.json();
}

export async function uploadFile(
  url: string,
  file: File,
  additionalData?: Record<string, string>
): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const res = await fetch(withBaseUrl(url), {
    method: "POST",
    headers: getAuthHeaders() as HeadersInit, // Add auth headers
    body: formData,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res.json();
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
