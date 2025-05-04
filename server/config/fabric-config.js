// config/fabric-config.js
export const fabricConfig = {
  channelName: process.env.CHANNEL_NAME,
  contractName: process.env.CONTRACT_NAME,
  appUser: process.env.APP_USER,
  adminUser: process.env.ADMIN_USER,
  organizationMSP: process.env.ORGANIZATION_MSP,
};