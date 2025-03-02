import api, { endpoints } from "@/utils/api";

const customerService = {
  createCustomer: async ({ name, address, number }) => {
    try {
      const customer = await api.post(endpoints.customer.add, {
        name,
        address,
        number,
      });

      return customer;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getCustomer: async () => {
    try {
      const customer = await api.get(endpoints.customer.me);
      return customer;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  updateCustomer: async ({ id, data }) => {
    try {
      const customer = await api.patch(
        `${endpoints.customer.update}/${id}`,
        data
      );

      return customer;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
};

export default customerService;
