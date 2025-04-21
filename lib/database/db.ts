import { Kysely, PostgresDialect } from "kysely";
import { Database } from "./types";
import { config } from 'dotenv';
import { Pool } from "pg";


config();


if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable is required");
}


export const pgsqldial = new PostgresDialect({
	pool: new Pool({
			connectionString: process.env.DATABASE_URL,
		})
});


if (!pgsqldial) {
	throw new Error("No dialect found");
}

export const dialect = pgsqldial;

export const db = new Kysely<Database>({
  dialect,
});



