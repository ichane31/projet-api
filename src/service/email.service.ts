import { Injectable } from '@nestjs/common';
import { config } from '../config/env.config';
import nodemailer from 'nodemailer';
@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;
    private transporter2: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.zoho.com',
            port: 465,
            secure: true,
            auth: {
                user: config.EMAIL_USERNAME,
                pass: config.EMAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }

        });
        this.transporter2 = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.EMAIL_USERNAME,
                pass: config.EMAIL_PASSWORD
            },

        });
    }

    public async sendMail(email: any, toEmail: string, subject: string) {
        let options = {
            from: 'ichaneapis@zohomail.com',
            to: toEmail,
            subject: subject,
            html: email
        };

        this.transporter.sendMail(options, function (error, info) {
            if (error) {
                console.log(error);

            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }

    public async sendMailQuestion (email : any , subject : string , message : string) {
        let options = {
            from : email,
            to: 'ichaneapis@zohomail.com',
            subject: subject,
            html: message
        };

        this.transporter.sendMail(options , function(error , info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Question envoyé' + info.response);
        }
        });
    }

}

export default new EmailService();