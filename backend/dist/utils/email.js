"use strict";
// import nodemailer from 'nodemailer';
// import pug from 'pug';
// import { TUser } from '../types';
// export class Email {
//   private to: string;
//   private username: string;
//   private url: string;
//   private from: string;
//   constructor(user: TUser, url: string) {
//     this.to = user.email;
//     this.username = user.username;
//     this.url = url;
//     this.from = `KickTalk`;
//   }
//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       return nodemailer.createTransport({
//         service: 'SendGrid',
//         auth: {
//           user: process.env.SENDGRID_USERNAME,
//           pass: process.env.SENDGRID_PASSWORD,
//         },
//       });
//     }
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }
//   async send(template: string, subject: string) {
//     const html = pug.renderFile(`${__dirname}/..views/email/${template}.pug`, {
//       username: this.username,
//       url: this.url,
//       subject,
//     });
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: 'yo',
//     };
//     await this.newTransport().sendMail(mailOptions);
//   }
//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to KickTalk');
//   }
//   async sendPasswordReset() {
//     await this.send('passwordReset', 'Your password reset token');
//   }
// }
