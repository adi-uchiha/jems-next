import { LibsqlDialect } from "@libsql/kysely-libsql";
import { Kysely } from "kysely";
import { Database } from "./types";
import { config } from 'dotenv';


config();


if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL environment variable is required");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN environment variable is required");
}


export const libsql = new LibsqlDialect({
	url: process.env.TURSO_DATABASE_URL,
	authToken: process.env.TURSO_AUTH_TOKEN,
});

if (!libsql) {
	throw new Error("No dialect found");
}

export const dialect = libsql;

export const db = new Kysely<Database>({
  dialect,
});



