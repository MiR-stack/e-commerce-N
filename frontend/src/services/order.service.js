import api, { endpoints } from "@/utils/api";

const orderServices = {
  addToCart: async ({ product_id, quantity, color_id, size_id }) => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const newSessionId = await api.post(
        endpoints.cart.add,
        {
          product_id,
          quantity,
          color_id,
          size_id,
        },
        {
          headers: {
            "x-session-id": sessionId,
          },
        }
      );

      if (!sessionId || sessionId !== newSessionId) {
        localStorage.setItem("sessionId", newSessionId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  clearCart: async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      await api.delete(endpoints.cart.remove, {
        headers: {
          "x-session-id": sessionId,
        },
      });

      localStorage.removeItem("sessionId");
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  createOrder: async ({
    shipping_address,
    number,
    payment_method_id,
    coupon_code,
    delivery_area_id,
    products,
  }) => {
    try {
      const order = await api.post(endpoints.order.add, {
        shipping_address,
        number,
        payment_method_id,
        delivery_area_id,
        coupon_code,
        items: products,
      });

      return order;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

export default orderServices;
