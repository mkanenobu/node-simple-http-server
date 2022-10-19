import fs from "fs/promises";
import { findFiles } from "./find-files";
import path from "path";
import { HttpError } from "./http-error";

export const searchPath = async (
  requestPath: string
): Promise<{ exact: string } | { dirList: string[] }> => {
  let filepath: string;
  const stat = await fs.stat(requestPath);
  if (stat.isDirectory()) {
    const files = await findFiles(requestPath);
    if (files.includes("index.html")) {
      filepath = path.join(requestPath, "index.html");
    } else {
      return { dirList: files };
    }
  } else if (stat.isFile()) {
    filepath = path.join(requestPath);
  } else {
    throw new HttpError(404, `404: ${requestPath} is not found.`);
  }

  return { exact: filepath };
};
