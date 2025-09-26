import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import * as migrator from "models/migrator.js";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(_, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postHandler(_, response) {
  const migratedMigrations = await migrator.runPendingMigrations();
  return response
    .status(migratedMigrations.length > 0 ? 201 : 200)
    .json(migratedMigrations);
}
