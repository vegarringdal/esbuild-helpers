import express from "express";
import compression from "compression";
const zlib = require('node:zlib');
const app = express();
const port = 80;

app.use(
  compression({
    threshold: 1,
    flush: zlib.constants.Z_SYNC_FLUSH,
  })
);

app.use(
  express.static("./dist_client", {
    etag: false,
    maxAge: "5",
  })
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost  :${port}`);
});
