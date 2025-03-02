import api from "@/utils/api";

const getSiteData = async () => {
  try {
    const settings = await api.get("/settings");
    return settings;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export { getSiteData };
