import { Client } from "pg";
import { ServiceError } from "./errors.js";

// const pool = new Pool({
//   host: process.env.POSTGRES_HOST,
//   port: process.env.POSTGRES_PORT,
//   user: process.env.POSTGRES_USER,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
// });

// async function query(queryObject) {
//   let client;
//   try {
//     client = await pool.connect();
//     const result = await client.query(queryObject);
//     return result;
//   } catch (error) {
//     console.log(error);
//   } finally {
//     client.release();
//   }
// }

async function query(queryObject) {
  let client;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Error na conexão com o Banco ou na Query",
      cause: error,
    });
    throw serviceError;
  } finally {
    await client?.end();
  }
}

const getSSLValues = () => {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  if (process.env.NODE_ENV === "production") return true;

  return false;
};

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

export default database;
