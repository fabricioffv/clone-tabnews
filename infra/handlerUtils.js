import { InternalServerError, MethodNotAllowedError } from "./errors";

export function onErrorHandler(error, _, res) {
  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.log("\n Erro dentro do catch do next-connect");
  console.error(publicErrorObject);

  res.status(500).json(publicErrorObject);
}

export function onNoMatchHandler(_, res) {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
}
