import Knex from "knex";
import { resolve, join } from "path";
import { Model } from "objection";
import { getLogger } from "../../../logger";
import Config from "../../../config";
import "mysql";
// import { bugsnagClient } from "../../bugsnag";

const logger = getLogger();

let _knex: Knex;

// Provides a knex config with the appropriate configuration variables retrieved for the environment
export const getKnexConfig = async (): Promise<Knex.Config> => ({
  client: "mysql",
  version: "5.7.25",
  connection: {
    host: Config.getDbHost(),
    user: Config.getDbUser(),
    password: Config.getDbPassword(),
    database: Config.getDbName(),
    port: parseInt(Config.getDbPort(), 10),
    timezone: "utc",
    typeCast: (field: any, next: any) => {
      // This is necessary to ensure any DB field that is a TINY type gets converted to a Javascript boolean type
      if (field.type == "TINY" && field.length == 1) {
        const value = field.string();
        return value ? value == "1" : null;
      }
      return next();
    },
    charset: "utf8mb4"
  },
  pool: { min: 1, max: 1 }
});

export const getDb = async () => {
  if (_knex) {
    return _knex;
  }
  _knex = Knex(await getKnexConfig());

  // Initialize Objection
  Model.knex(_knex);
  return _knex;
};

export const canConnect = async () => {
  try {
    await getKnexConfig();
    return true;
  } catch (e) {
    logger.error("An error occurred getting config", { e });
    return false;
  }
};

export const migrate = async () => {
  const knex = await getDb();
  const migrationsDirectory = resolve(join(__dirname, 'migrations'));
  try {
    const migrationsConfig = {
      directory: migrationsDirectory,
      tableName: "_knex_migrations"
    };
    const migrations = await knex.migrate.latest(migrationsConfig);
    logger.info("DB Migration finished.", { migrationsApplied: migrations });
  } catch (e) {
    logger.error("Unable to perform DB Migration", { e });
    // if (Config.getIsLocal()) {
    //   logger.error("Unable to perform DB Migration", { e });
    // } else {
    //   bugsnagClient.notify(e);
    // }
  }
};
