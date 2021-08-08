"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynaEmailSender = void 0;
var nodemailer = require("nodemailer");
var DynaEmailSender = /** @class */ (function () {
    function DynaEmailSender(config) {
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
    DynaEmailSender.prototype.send = function (email) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var toAddress;
            if (Array.isArray(email.toAddress))
                toAddress = email.toAddress.join(', ');
            else
                toAddress = email.toAddress;
            _this.transporter.sendMail({
                from: "\"" + email.fromTitle + "\" <" + email.fromAddress + ">",
                to: toAddress,
                subject: email.subject,
                html: email.html,
                text: email.text,
            }, function (error, info) {
                if (error) {
                    reject({
                        code: 1601182204,
                        section: 'EmailSender/send',
                        message: 'General send error',
                        data: {
                            email: { from: "\"" + email.fromTitle + "\" <" + email.fromAddress + ">", to: toAddress, subject: email.subject },
                            senderLibInfo: info,
                        },
                        error: error,
                    });
                }
                else {
                    resolve(info.messageId);
                }
            });
        });
    };
    DynaEmailSender.prototype.close = function () {
        this.transporter.close();
    };
    return DynaEmailSender;
}());
exports.DynaEmailSender = DynaEmailSender;
//# sourceMappingURL=DynaEmailSender.js.map