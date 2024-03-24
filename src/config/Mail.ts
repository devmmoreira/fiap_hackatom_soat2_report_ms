import { env } from './env';

export const MailConfig = {
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  username: env.MAIL_USERNAME,
  password: env.MAIL_PASSWORD,
  encryption: env.MAIL_ENCRYPTION,
  fromName: env.MAIL_FROM_NAME,
  fromAddress: env.MAIL_FROM_ADDRESS,
};
