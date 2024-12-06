import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  async generate(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html);

    await page.addStyleTag({
      content: `
        @page {
          margin-bottom: 50px;
          counter-increment: page;
        }
      `,
    });

    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        left: '10px',
        top: '10px',
        right: '10px',
        bottom: '10px',
      },
    });

    await browser.close();

    return buffer;
  }
}
