import axios from "axios";

export const checkLocation = async (req, res, next) => {
  try {
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress;

    console.log("Raw Detected IP:", ip);

    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    const response = await axios.get(`https://ipinfo.io/${ip}/json`);
    const location = response.data;
    console.log("Geolocation data:", location);

    if (!location.bogon && location.country !== "PK") {
      return res.status(403).json({
        success: false,
        message: "Access denied. VPN/Proxy or foreign IP detected.",
        errorCode: "LOCATION_RESTRICTED",
      });
    }

    next();
  } catch (error) {
    console.error("Error in geolocation lookup:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error during IP verification.",
    });
  }
};
