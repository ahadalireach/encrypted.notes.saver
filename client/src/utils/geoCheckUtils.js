// utils/geoCheckUtils.js
import api from "../utils/api";

export const checkGeoBlockStatus = async () => {
  try {
    const response = await api.get("/health");

    if (response.status === 200) {
      const geoBlockError = localStorage.getItem("geoBlockError");

      if (geoBlockError) {
        const errorData = JSON.parse(geoBlockError);
        if (errorData.errorCode === "LOCATION_RESTRICTED") {
          localStorage.removeItem("geoBlockError");
          return true;
        }
      }
    }
  } catch (error) {
    console.error("Error checking geo-block status:", error);
  }

  return false;
};
