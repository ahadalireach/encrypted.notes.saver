import { useEffect, useState } from "react";
import axios from "axios";

const GetIP = () => {
  const [ip, setIP] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    const fetchIPAndCountry = async () => {
      try {
        const ipRes = await axios.get("https://api.ipify.org?format=json");
        const userIP = ipRes.data.ip;
        setIP(userIP);

        const locationRes = await axios.get(`https://ipwho.is/${userIP}`);
        if (locationRes.data.success) {
          setCountry(locationRes.data.country);
        } else {
          console.warn("Failed to get location:", locationRes.data.message);
        }
      } catch (err) {
        console.error("Error fetching IP or location:", err);
      }
    };

    fetchIPAndCountry();
  }, []);

  return (
    <div>
      <p>Your IP: {ip}</p>
      <p>Your Country: {country}</p>
    </div>
  );
};

export default GetIP;
