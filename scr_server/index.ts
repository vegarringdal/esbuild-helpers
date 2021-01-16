import express from "express";
const app = express();
const port = 80;

app.use(express.static("./dist_client", {
  etag: false,
  maxAge: '5'
}));

app.listen(port, () => {
  console.log(`Example app listening else at http://localhost  :${port}`);
});


