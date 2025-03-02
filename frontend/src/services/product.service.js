import api, { endpoints } from "../utils/api";

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        minPrice,
        maxPrice,
        quantity,
        sortBy,
        sortOrder,
        fields,
        featured,
        special,
        category,
        color,
        size,
      } = params;
      const response = await api.get(endpoints.products.list, {
        params: {
          page,
          limit,
          search,
          minPrice,
          maxPrice,
          quantity,
          sortBy,
          sortOrder,
          fields,
          featured,
          special,
          category,
          color,
          size,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getRelatedProducts: async (id) => {
    try {
      const response = await api.get(`products/${id}/related`);
      return response;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

  // Get product categories
  getCategories: async ({ fields, page = 1, limit = 5 }) => {
    try {
      const response = await api.get(endpoints.products.categories, {
        params: { fields, page, limit, flat: true },
      });
      return response;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get single product details
  getProductDetails: async (productId, fields) => {
    try {
      const response = await api.get(endpoints.products.details(productId), {
        params: fields,
      });
      return response;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  getDeliveryAreas: async () => {
    try {
      const response = await api.get(endpoints.delivery_area.list);
      return response;
    } catch (error) {
      console.error("Error fetching delevery area:", error);
      throw error;
    }
  },

  getPaymentMethods: async () => {
    try {
      const response = await api.get(endpoints.payment_method.list);
      return response;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  },

  getColors: async ({ fields }) => {
    try {
      const response = await api.get("/colors", { params: { fields } });
      return response;
    } catch (error) {
      console.error("Error fetching colors:", error);
      throw error;
    }
  },
  getSizes: async ({ fields }) => {
    try {
      const response = await api.get("/sizes", { params: { fields } });
      return response;
    } catch (error) {
      console.error("Error fetching sizes:", error);
      throw error;
    }
  },
};

export default productService;
