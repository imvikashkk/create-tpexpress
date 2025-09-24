import geoip from "geoip-lite";

/* IP Information and Geo Information */
const callFrom = (ip: string | number | undefined) => {
  if (typeof ip === "undefined") {
    return {};
  }

  if (ip === "::1" || ip === "127.0.0.1") {
    return {};
  }

  const geo = geoip.lookup(ip);

  console.info({ ipdata: geo });

  if (geo === null) {
    return {};
  }

  return geo;
};

export default callFrom;
