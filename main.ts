import http from "http";
import fs from "fs/promises";
import path from "path";
import { getContentTypeByFilepath } from "./src/mime-type";
import { searchPath } from "./src/search-path";
import { HttpError } from "./src/http-error";

const handler: http.RequestListener = async (req, res) => {
  console.log("request ", req.url);

  const requestPath = path.join(".", req.url ?? "");

  const searched = await searchPath(requestPath).catch((err) => {
    if (err instanceof HttpError) {
      res.writeHead(err.status, { "Content-Type": "text/plain" });
      res.end(err.message);
    }
    return null;
  });

  if (searched === null) {
    return;
  } else if ("dirList" in searched) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      `<ul>${searched.dirList
        .map(
          (file) =>
            `<li><a href="${path.join(req.url ?? "", file)}">${file}</a></li>`
        )
        .join("\n")}</ul>`
    );
    return;
  }

  await fs
    .readFile(searched.exact)
    .then((content) => {
      res.writeHead(200, {
        "Content-Type": getContentTypeByFilepath(searched.exact),
      });
      res.end(content, "utf-8");
    })
    .catch((err) => {
      if (err.code === "ENOENT") {
        res.writeHead(404);
        res.end(`404: ${req.url} is not found.`);
        return;
      }
      console.error(err);
      res.writeHead(500);
      res.end(`Sorry, check with the site admin for error: ${err.code} ..`);
    });
};

http.createServer(handler).listen(8080);
console.log("Serving at http://localhost:8080");
