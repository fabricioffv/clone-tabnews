import database from "infra/database.js";
import { ServiceError } from "infra/errors";
import migrationRunner from "node-pg-migrate";
import path from "node:path";

const defaultMigrationOptions = {
  dryRun: true,
  dir: path.resolve("infra", "migrations"),
  direction: "up",
  verbose: false,
  log: () => {},
  migrationsTable: "pgmigrations",
};

export async function listPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return pendingMigrations;
  } catch (error) {
    const serviceError = new ServiceError({
      cause: error,
    });
    throw serviceError;
  } finally {
    await dbClient?.end();
  }
}

export async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
      dbClient,
    });

    return migratedMigrations;
  } catch (error) {
    const serviceError = new ServiceError({
      cause: error,
    });
    throw serviceError;
  } finally {
    await dbClient?.end();
  }
}
