export const handleGeoBlockError = (error) => {
  if (error.response && error.response.status === 403) {
    const errorData = error.response.data;

    if (
      errorData.errorCode === "LOCATION_RESTRICTED" ||
      errorData.message.includes("VPN/Proxy or foreign IP detected")
    ) {
      localStorage.setItem("geoBlockError", JSON.stringify(errorData));
      window.dispatchEvent(
        new CustomEvent("geoBlockError", { detail: errorData })
      );
      return Promise.reject(errorData);
    }
  }
  return null;
};
