import { query } from "@solidjs/router";

import { getMaybeSessionServer, getSessionServer } from "~/lib/auth";

export const getMaybeSession = query(async () => {
  "use server";

  return await getMaybeSessionServer();
}, "maybeSession");

export const getSession = query(async () => {
  "use server";
  return await getSessionServer();
}, "session");
