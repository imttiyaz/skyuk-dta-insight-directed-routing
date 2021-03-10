const { Sequelize } = require('sequelize');
const LOGGER = require('../logger')(__filename);
const COMMON = require("../common");
const CONFIG = require('../config');

//Creating a DB connection and return the connection
const getConnection = async () => {

  let Process_NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : null;

  //Cloud SQL db connections
  var host = process.env.DATABASE_CLOUD_SQL_INSTANCE_NAME || COMMON.CONSTANTS.DATABASE_CLOUD_SQL_INSTANCE_NAME;
  if (Process_NODE_ENV != null && Process_NODE_ENV === COMMON.CONSTANTS.DEVELOPMENT_ENVIRONMENT) {
    var user = process.env.DATABASE_USERNAME;
    var password = process.env.DATABASE_PASSWORD;
  }
  else {
    var user = await CONFIG.GCP_SECERT_ACCESSOR(process.env.DATABASE_USERNAME_KEY);
    var password = await CONFIG.GCP_SECERT_ACCESSOR(process.env.DATABASE_PASSWORD_KEY);
  }

  var database = process.env.DATABASE_NAME || COMMON.CONSTANTS.DATABASE_NAME;
  var port = process.env.DATABASE_PORT || COMMON.CONSTANTS.DATABASE_PORT;

  LOGGER.info("Creating DB connection in getConnection");

  //Creating a connection to the Database
  var db = new Sequelize(database, user, password, {
    dialect: 'postgres',
    logging: true,
    host: host,
    port: port,
    pool: {
      max: 20,
      min: 2,
      acquire: 30000,
      idle: 20000
    },
    dialectOptions: {
      socketPath: host,
      options: {
        requestTimeout: 3000
      }
    },
    logging: false,
    operatorsAliases: false
  });

  LOGGER.info("DB connection created");


  //DB authentication
  (async () => {
    await db.authenticate()
      .then(() => {
        LOGGER.info("Connection has been established successfully*****.")
      })
      .catch((err) => {
        LOGGER.error(`Unable to connect to the database**** - ${err.message}`)
      });
  })();

  return db;

}

module.exports = getConnection;


