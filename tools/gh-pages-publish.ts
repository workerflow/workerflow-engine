import { cd, echo, exec, touch } from "shelljs";
import { readFileSync } from "fs";
import url from "url";

let repoUrl: any;
let pkg = JSON.parse(readFileSync("package.json") as any);
if (typeof pkg.repository === "object") {
  if (!pkg.repository.hasOwnProperty("url")) {
    throw new Error("URL does not exist in repository section");
  }
  repoUrl = pkg.repository.url;
} else {
  repoUrl = pkg.repository;
}

let parsedUrl = url.parse(repoUrl);
let repo = (parsedUrl.host || "") + (parsedUrl.path || "");
let token = process.env.GH_TOKEN;

echo("Deploying docs!!!");
cd("docs");
touch(".nojekyll");
exec("git init");
exec("git add .");
exec('git config user.name "Tosone"');
exec('git config user.email "i@tosone.cn"');
exec('git commit -m "docs(docs): update gh-pages"');
exec(`git push --force --quiet "https://${token}@${repo}" master:gh-pages`);
echo("Docs deployed!!");
