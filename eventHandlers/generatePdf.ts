import puppeteer from "https://deno.land/x/puppeteer@9.0.2/mod.ts";
import Queue from "https://deno.land/x/queue/mod.ts";

type GeneratePdfParams = {
  targetFolder: string;
  uri: string;
  fileName: string;
};

const queue = new Queue();

const generatePdf = async (params: GeneratePdfParams) => {
  const { targetFolder, uri, fileName } = params;

  await queue.push(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:3000/${uri}`);

    await page.pdf({
      path: `${targetFolder}/${fileName}`,
      format: "a4",
      scale: 0.8,
      printBackground: true,
    });

    await browser.close();
  });
};

export default generatePdf;
