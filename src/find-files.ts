import fs from "fs/promises";

export const findFiles = (path: string) => fs.readdir(path, "utf-8");
