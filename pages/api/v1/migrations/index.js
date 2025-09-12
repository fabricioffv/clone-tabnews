import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import path from "node:path";

export default async function migrations(request, response) {
  if (!["POST", "GET"].includes(request.method)) {
    return response.status(405).json({
      error: `Method now allowed ${request.method}`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: path.resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);
      response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });
      response
        .status(migratedMigrations.length > 0 ? 201 : 200)
        .json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
