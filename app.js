import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
// ES6では__dirnameが備わっていないため、下記で用意する必要あり
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static("static"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/auth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});
// ①エンドポイント(/user/signin/callback)はgithubで登録する
app.get("/user/signin/callback", ({ query: { code } }, res) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_SECRET,
    code,
  };
  // ②githubのtokenを/user/で使用するので
  axios
    .post("https://github.com/login/oauth/access_token", body, {
      headers: { accept: "application/json" },
    })
    .then((res) => res.data)
    .then((data) => {
      console.log("githubトークン: ", data);
      res.json({ token: data.access_token });
    })
    .catch((err) => res.status(500).json({ err: err.message }));
});
// ③ ②で取得したtokenをaccessTokenに挿入してデータの取得をする
app.get("/user", (req, res, next) => {
  const accessToken = "tokenの文字列をここに代入";

  axios
    .get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    })
    .then((result) => {
      // console.log(result);
      // result.dataの中にあるuserNameを使用したい(Githubにログインするため)
      res.send(result.data);
    });
});

app.listen(PORT, () => {
  console.log(`${PORT}番サーバー起動`);
});
