import pool from "./dbPoolConfig";
import { USERS } from "./usersData";

const createUsersTableText = `
  CREATE TABLE IF NOT EXISTS "users" (
      id varchar,
      login varchar,
      password varchar,
      age int,
      deleted boolean
  );
  `;

const insertUserText =
  "INSERT INTO users(id, login, password, age, deleted) VALUES ($1, $2, $3, $4, $5)";

(async () => {
  const client = await pool.connect();

  try {
    // generating users in one transaction...
    await client.query("BEGIN");

    // create Users table
    await client.query(createUsersTableText);
    console.log("Users table created");

    // populate Users with test data
    USERS.forEach(async user => {
      const insertUserValues = Object.values({
        ...user,
      });
      await client.query(insertUserText, insertUserValues);
    });
    console.log("Users were populated with test data");

    // commit transaction, if no errors
    await client.query("COMMIT");
  } catch (error) {
    // rollback transaction in case of any error
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
})().catch(e => console.error(e.stack));
