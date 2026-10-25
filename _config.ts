import lume from "lume/mod.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import date from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import decapCMS from "lume/plugins/decap_cms.ts";
import { serverUrl } from "lume/deps/decap.ts";
import postcssNesting from "npm:postcss-nesting@14.0.3";
import { full as markdownEmoji } from "npm:markdown-it-emoji@3.1.0";
import generatePdf from "./eventHandlers/generatePdf.ts";

const markdown = {
  plugins: [markdownEmoji],
};

const site = lume(
  {
    location: new URL("https://denissb.github.io/"),
  },
  { markdown },
);

site.addEventListener("afterUpdate", (event) => {
  const isCVUpdate = event.files && event.files.has("/cv.md");
  if (isCVUpdate) {
    generatePdf({
      targetFolder: "./assets",
      uri: "/cv",
      fileName: "Deniss_Borisovs_CV.pdf",
    });
  }
});

site
  .ignore("README.md")
  .ignore("AGENTS.md")
  .use(nunjucks())
  .use(terser())
  .use(postcss({ plugins: [postcssNesting()] }))
  .use(date())
  .use(codeHighlight())
  .use(basePath())
  .use(slugifyUrls({ alphanumeric: false }))
  .use(resolveUrls())
  .use(decapCMS({
    identity: "netlify",
    // The default proxy command only allows binding to 0.0.0.0, which fails
    // on systems where the proxy listens on [::].
    proxyCommand:
      `deno run --allow-read --allow-net --allow-write --allow-env ${serverUrl}`,
  }))
  .copy("img")
  .copy("assets")
  .copy("snaptext")
  .add([".css"])
  .add([".js"]);

export default site;
