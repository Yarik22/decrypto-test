import { HttpException, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import * as nodemailer from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class MailsService {
    async sendActivationMail(email:string,activationLink):Promise<void>{
        // console.log(process.env.SMPT_HOST,process.env.SMPT_PORT,process.env.SMPT_USER,process.env.SMPT_PASSWORD)
        console.log(email)
        console.log(activationLink)
        const transporter=nodemailer.createTransport({
            service:'gmail',
            host:process.env.SMPT_HOST,
            port:parseInt(process.env.SMPT_PORT),
            secure:false,
            auth:{
                user:process.env.SMPT_USER,
                pass:process.env.SMPT_PASSWORD
            }
        })
        const mailOptions:MailOptions ={
            from:process.env.SMPT_USER,
            to:email,
            subject: "Activation of your account on "+ process.env.API_URL,
            text: '',
            html:     
            `<div>
            <h1>
                Activate your account by link
            </h1>
            <a href=${activationLink}>
            ${activationLink}                
            </a>
            </div>`
        }
        transporter.sendMail(mailOptions,(error, info) => {
            if (error) {
                throw new HttpException("Email is not sent",HttpStatus.BAD_REQUEST)
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}
