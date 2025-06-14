import { Pool, Client } from "pg";

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
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}

const getSSLValues = () => {
  if (process.env.NODE_ENV === "development") return false;

  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return true;
};

export default {
  query: query,
};
