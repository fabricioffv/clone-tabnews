import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, response) {
  const pgVersionQuery = await database.query("SHOW server_version;");
  const pgVersion = pgVersionQuery.rows[0].server_version;

  const pgMaxConnQuery = await database.query("SHOW max_connections;");
  const pgMaxConn = pgMaxConnQuery.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const pgConnCountQuery = await database.query({
    text: "select count(*)::int from pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });
  const pgConnCount = pgConnCountQuery.rows[0].count;

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: pgVersion,
        max_connections: parseInt(pgMaxConn),
        opened_connections: pgConnCount,
      },
    },
  });
}
