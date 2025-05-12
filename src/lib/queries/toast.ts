import { query } from "@solidjs/router";
import { deleteCookie, getCookie } from "vinxi/http";

import * as v from "valibot";

export const getToastMessage = query(async () => {
  "use server";
  const cookie = getCookie("toast");
  if (!cookie) return null;

  const toast = JSON.parse(cookie);

  deleteCookie("toast");
  return v.parse(
    v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      variant: v.picklist(["default", "destructive", "success", "warning", "error"]),
    }),
    toast
  );
}, "toast");
