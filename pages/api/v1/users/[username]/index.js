import { createRouter } from "next-connect";
import controller from "infra/controller.js";
import * as user from "models/user.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userName = request.query.username;
  const userFound = await user.findOneByUsername(userName);
  return response.status(200).json(userFound);
}
