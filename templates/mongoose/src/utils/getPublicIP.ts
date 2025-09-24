import os from 'os';

const getPublicIP = (): string => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (!interfaces[name]) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  throw new Error('No public IP address found');
};

export default getPublicIP;
