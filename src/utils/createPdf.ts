import fs from 'node:fs';
import path from 'node:path';
import { compile } from 'handlebars';
import puppeteer from 'puppeteer';
import { randomUUID } from 'node:crypto';

interface PdfData {
  data: {
    [key: string]: any;
  };
  template: 'user-registers-report';
}

export const createPDF = async ({ data, template: htmlTemplate }: PdfData): Promise<Buffer> => {
  const templateHtml = fs.readFileSync(path.join(process.cwd(), 'templates', 'reports', `${htmlTemplate}.handlebars`), 'utf8');

  const template = compile(templateHtml);

  const html = template(data);

  const pdfPath = path.join(process.cwd(), 'temp', `${randomUUID()}-${htmlTemplate}.pdf`);

  const options = {
    width: '1230px',
    headerTemplate: '<p></p>',
    footerTemplate: '<p></p>',
    displayHeaderFooter: false,
    margin: {
      top: '10px',
      bottom: '30px',
    },
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });

  const page = await browser.newPage();

  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0',
  });

  await page.pdf(options);
  await browser.close();

  const file = fs.readFileSync(pdfPath);
  fs.unlinkSync(pdfPath);

  return file;
};
