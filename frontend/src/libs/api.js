import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchAPI(endpoint, options = {}) {
  const headersList = headers();
  const apiKey = process.env.API_KEY;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey ? `Bearer ${apiKey}` : "",
      // Forward client headers if needed
      "X-Real-IP": headersList.get("x-real-ip"),
      "X-Forwarded-For": headersList.get("x-forwarded-for"),
    },
    ...options,
  };

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, defaultOptions);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

export const api = {
  products: {
    list: async (params = {}) => {
      const searchParams = new URLSearchParams(params);
      return fetchAPI(`/products?${searchParams}`);
    },
    getById: async ({ id, fields }) => {
      const searchParams = new URLSearchParams();

      if (fields) {
        searchParams.append("fields", fields);
      }

      return fetchAPI(`/products/${id}?${searchParams}`);
    },
    getDetails: async (id) => {
      return fetchAPI(`/products/${id}/details`);
    },
  },
  categories: {
    list: async (params = {}) => {
      params.flat = true;
      const searchParams = new URLSearchParams(params);

      return fetchAPI(`/categories?${searchParams}`);
    },
  },
  banners: {
    list: async (params = {}) => {
      const searchParams = new URLSearchParams(params);

      return fetchAPI(`/banners?${searchParams}`);
    },
  },
  siteData: {
    get: async () => {
      return fetchAPI("/settings");
    },
  },
};
