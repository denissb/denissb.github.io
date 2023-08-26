import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import postcss from "lume/plugins/postcss.ts";
import terser from "lume/plugins/terser.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import basePath from "lume/plugins/base_path.ts";
import slugifyUrls from "lume/plugins/slugify_urls.ts";
import resolveUrls from "lume/plugins/resolve_urls.ts";
import markdownEmoji from "https://jspm.dev/markdown-it-emoji";
import gpm from "https://deno.land/x/gpm@v0.5.0/mod.ts";
import netlifyCMS from "lume/plugins/netlify_cms.ts";
import generatePdf from "./eventHandlers/generatePdf.ts";

const markdown = {
  plugins: [markdownEmoji],
};

const site = lume(
  {
    location: new URL("https://denissb.github.io/"),
  },
  { markdown }
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
  .copy("img")
  .copy("assets")
  .copy("snaptext")
  .use(postcss())
  .use(terser())
  .use(date())
  .use(codeHighlight())
  .use(basePath())
  .use(slugifyUrls({ alphanumeric: false }))
  .use(resolveUrls())
  .use(netlifyCMS({ netlifyIdentity: true }))
  .addEventListener("beforeBuild", () => gpm(["oom-components/searcher"], "js/vendor"));

export default site;
