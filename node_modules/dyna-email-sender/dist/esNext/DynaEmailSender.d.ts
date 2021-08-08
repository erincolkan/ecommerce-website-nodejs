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
export declare class DynaEmailSender {
    private config;
    private transporter;
    constructor(config: IDynaEmailSenderConfig);
    send(email: IEmail): Promise<string>;
    close(): void;
}
