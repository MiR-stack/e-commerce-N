import axios from "axios";
import Swal from "sweetalert2";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Don't show error alert for customer not found case
    if (
      error.response?.config?.url === "/customers/me" &&
      error.response?.status === 404
    ) {
      return Promise.resolve(null); // or return Promise.resolve(false)
    }
    // Handle errors with SweetAlert2
    const errorMessage = error.response?.data?.message || "An error occurred";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  products: {
    list: "/products",
    featured: "/products/featured",
    categories: "/categories",
    details: (id) => `/products/${id}`,
    search: "/products/search",
  },
  cart: {
    add: "/cart/add",
    remove: "/cart/clear",
    list: "/cart/me",
  },

  delivery_area: {
    list: "/delivery-areas",
  },
  payment_method: {
    list: "/payment-methods",
  },
  customer: {
    add: "/customers",
    me: "/customers/me",
    update: "/customers",
  },
  order: {
    add: "/orders",
  },
};

export default api;
