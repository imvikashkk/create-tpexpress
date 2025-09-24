import { UAParser } from "ua-parser-js";

const callBy = (userAgentString: string) => {
  /* Browser and Device Information */
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();
  const browserName = result?.browser?.name;
  const browserVersion = result?.browser?.version;
  const osName = result?.os?.name;
  const osVersion = result?.os?.version;
  const deviceType = result?.device?.type;
  const deviceVendor = result?.device?.vendor;
  const deviceModel = result?.device?.model;

  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    deviceType,
    deviceVendor,
    deviceModel,
  };
};

export default callBy;
