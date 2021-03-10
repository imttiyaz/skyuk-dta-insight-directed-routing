const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const LOGGER = require('../logger')(__filename);

const client = new SecretManagerServiceClient();

//Access the Secret Manager value using the Secret manager key
async function accessSecretVersion(secret, version = "latest") {
  const [data] = await client.accessSecretVersion({
    name: `projects/${process.env.PROJECT_NAME}/secrets/${secret}/versions/${version}`
  });

  const payload = data.payload.data.toString();
  LOGGER.info(`Fetched ${secret} from Secret Manager`);
  return payload;
}

module.exports = accessSecretVersion;



