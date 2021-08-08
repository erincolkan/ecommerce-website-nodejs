import "jest";
import * as nodemailer from "nodemailer";

import {DynaEmailSender} from "../../src";
import {IError} from "dyna-interfaces";

describe('Send mails with EmailSender', () => {
  let user: string, pass: string;

  beforeAll(done => {
    nodemailer.createTestAccount((err: Error | null, account) => {
      if (err) fail({message: 'Error on beforeAll nodemailer.createTestAccount', error: err});
      user = account.user;
      pass = account.pass;
      done();
    });
  });

  it('should send email', (done: Function) => {
    const sender: DynaEmailSender = new DynaEmailSender({
      host: 'smtp.ethereal.email',
      port: 587,
      tls: false,
      username: user,
      password: pass,
      allowInvalidCertificates: false,
    });

    sender.send({
      fromTitle: 'Info My Company 👻',      // sender address
      fromAddress: 'info@my-company.com',   // sender address
      toAddress: 'lola@foo.co',             // list of receivers
      subject: 'Hello ✔',                   // Subject line
      text: 'Hello world?',                 // plain text body
      html: '<b>Hello world?</b>',          // html body
    })
      .then((messageId: string) => {
        expect(!!messageId).toBe(true);
        done();
      })
      .catch((error: IError) => {
        console.log('email send failed', {error});
        expect(!!error).toBe(false);
        done();
      });
  });
});
