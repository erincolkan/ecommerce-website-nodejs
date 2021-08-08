# About

Send emails easily! _From Node.js_

In Typescript.

# Example
```
import {DynaEmailSender} from "dyna-email-sender";

const sender = new DynaEmailSender({
  host: 'smtp.ethereal.email',
  port: 587,
  tls: false,
  username: 'info@my-company.com',
  password: 'pass-matters',
  allowInvalidCertificates: false,
});

sender.send({
  fromTitle: 'Info My Company 👻',       
  fromAddress: 'info@my-company.com',    
  toAddress: 'lola@foo.co',             // or array of addresses
  subject: 'Hello ✔', 
  text: 'Hello world?',
  html: '<b>Hello world?</b>',
})
  .catch((error: IError) => {
    console.log('email send failed', {error});
  });

```

# Methods

## send(email: IEmail): Promise<void>

```
interface IEmail {
  fromTitle: string;
  fromAddress: string;
  toAddress: string | string[];
  subject: string;
  text: string;
  html: string;
}
```

## close(): void

Closes any open connection
