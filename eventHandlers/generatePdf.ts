type GeneratePdfParams = {
  targetFolder: string;
  uri: string;
  fileName: string;
};

let running = Promise.resolve();

const generatePdf = (params: GeneratePdfParams) => {
  const task = running.then(() => createPdf(params)).catch((error) => {
    console.error("[generatePdf]", error);
  });

  running = task;

  return task;
};

async function createPdf(
  { targetFolder, uri, fileName }: GeneratePdfParams,
) {
  // Imported dynamically so a missing/unavailable Puppeteer installation
  // cannot break the site build.
  const { default: puppeteer } = await import("npm:puppeteer@25");

  const browser = await puppeteer.launch({
    executablePath: await getChromePath(),
  });

  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);

    await page.goto(`http://localhost:3000/${uri}/`, {
      waitUntil: "networkidle2",
    });

    await page.pdf({
      path: `${targetFolder}/${fileName}`,
      format: "a4",
      printBackground: true,
    });
  } finally {
    await browser.close();
  }
}

async function getChromePath(): Promise<string | undefined> {
  const fromEnv = Deno.env.get("PUPPETEER_EXECUTABLE_PATH") ??
    Deno.env.get("CHROME_PATH");

  if (fromEnv) {
    return fromEnv;
  }

  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];

  for (const candidate of candidates) {
    try {
      await Deno.stat(candidate);
      return candidate;
    } catch {
      // Try the next candidate
    }
  }
}

export default generatePdf;
