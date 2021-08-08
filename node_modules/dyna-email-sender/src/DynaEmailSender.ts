import * as nodemailer from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";
import {IError} from "dyna-interfaces";

export interface IDynaEmailSenderConfig {
  host: string;
  port: number;
  tls: boolean;
  username: string;
  password: string;
  allowInvalidCertificates: boolean;
}

export interface IEmail {
  fromTitle: string;
  fromAddress: string;
  toAddress: string | string[];
  subject: string;
  text: string;
  html: string;
}

export class DynaEmailSender {
  private config: IDynaEmailSenderConfig;
  private transporter: Mail;

  constructor(config: IDynaEmailSenderConfig) {
    this.config = config;

    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.tls,
      auth: {
        user: this.config.username,
        pass: this.config.password,
      },
      tls: {
        rejectUnauthorized: this.config.allowInvalidCertificates,
      },
    });
  }

  public send(email: IEmail): Promise<string> {
    return new Promise((resolve: (messageId: string) => void, reject: (error: IError) => void) => {
      let toAddress: string;
      if (Array.isArray(email.toAddress)) toAddress = email.toAddress.join(', '); else toAddress = email.toAddress;

      this.transporter.sendMail(
        {
          from: `"${email.fromTitle}" <${email.fromAddress}>`,
          to: toAddress,
          subject: email.subject,
          html: email.html,
          text: email.text,
        },
        (error: any, info: any) => {
          if (error) {
            reject({
              code: 1601182204,
              section: 'EmailSender/send',
              message: 'General send error',
              data: {
                email: {from: `"${email.fromTitle}" <${email.fromAddress}>`, to: toAddress, subject: email.subject},
                senderLibInfo: info,
              },
              error,
            });
          }
          else {
            resolve(info.messageId);
          }
        });
    });
  }

  public close(): void {
    this.transporter.close();
  }
}
