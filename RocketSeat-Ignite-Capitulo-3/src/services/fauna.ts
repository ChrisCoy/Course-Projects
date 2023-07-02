import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.NEXT_PUBLIC_FAUNADB_KEY,
});
