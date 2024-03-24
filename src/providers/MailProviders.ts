import fs from 'node:fs';
import path from 'node:path';
import handlebars from 'handlebars';
import { Transporter, createTransport } from 'nodemailer';

import { MailConfig } from '@config/Mail';
import { Options as MailOptions } from 'nodemailer/lib/mailer';

interface ISendParams {
  to: string;
  subject: string;
  message?: string;
  template?: string;
  attachments?: any;
  variablesHtml?: {
    [key: string]: string | number | Date;
  };
}

export class MailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: MailConfig.host,
      port: MailConfig.port,
      secure: false,
      auth: {
        user: MailConfig.username,
        pass: MailConfig.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  public async sendMail({ to, message, subject, template, variablesHtml, attachments }: ISendParams): Promise<void> {
    const content_template = fs.readFileSync(path.resolve(process.cwd(), 'templates', 'mail', template + '.handlebars')).toString();

    const content = handlebars.compile(content_template);

    const mailOptions: MailOptions = {
      from: MailConfig.fromAddress,
      to,
      subject,
    };

    if (attachments) {
      mailOptions.attachments = attachments as any;
    }

    console.log(mailOptions);

    if (template) {
      mailOptions.html = variablesHtml ? content(variablesHtml) : undefined;
    } else {
      mailOptions.html = message;
    }

    await this.transporter.sendMail(mailOptions);
  }
}
