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
    const path = `${targetFolder}/${fileName}`;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:3000/${uri}`, {
      waitUntil: "networkidle2",
    });

    await page.pdf({
      path,
      format: "a4",
      printBackground: true,
    });

    await browser.close();
  });
};

export default generatePdf;
