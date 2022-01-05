- npm init -y
- git init

- mkdir .gitignore

  - add node_modules

- npm i -D nodemon

- npm i axios express dotenv passport passport-github

- package.json

```
  "start": "node app.js",
  "dev": "nodemon app.js",
```

- GITHUB_CLIENT_ID と GITHUB_SECRET を取得して.env に環境変数として設置
- client から飛んできた req より、github アカウント認証ページに遷移

```
app.get("/auth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});
```

- 登録した 「Authorization callback URL」をパスに設定しておく(req に含まれる query の code が必要)

- token の発行(headers に json 形式を指定)

```
// 第一引数:url,第二引数:client_idとclient_secret,codeを含むオブジェクト,第三引数：
axios
    .post("https://github.com/login/oauth/access_token", body, {
      headers: { accept: "application/json" },
    })
    .then((res) => res.data)
```

- 発行した token より、userName を取得(login できる様にするため)

```
//
{
  "login"              :"******",←必要
  "id"                 :******,
  "node_id"            :"******",
  "avatar_url"         :"******",
  "gravatar_id"        :"******",
  "url"                :"******",
  "html_url"           :"******",
  "followers_url"      :"******",
  "following_url"      :"******",
  "gists_url"          :"******",
  "starred_url"        :"******",
  "subscriptions_url"  :"******",
  "organizations_url"  :"******",
  "repos_url"          :"******",
  "events_url"         :"******",
  "received_events_url":"******",
  "type"               :"******",
  "site_admin"         :******,
  "name"               :******,
  "company"            :******,
  "blog"               :"******",
  "location"           :******,
  "email"              :******,
  "hireable"           :******,
  "bio"                :******,
  "twitter_username"   :******,
  "public_repos"       :******,
  "public_gists"       :******,
  "followers"          :******,
  "following"          :******,
  "created_at"         :"******",
  "updated_at"         :"******"}
```
