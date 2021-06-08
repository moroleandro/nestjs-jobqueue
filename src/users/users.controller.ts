import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { SendMailProducerService } from 'src/jobs/sendMail-producer-service';
import { UsersDTO } from './users-dto';

@Controller('users')
export class UsersController {
    constructor(private sendMailService: SendMailProducerService){}

    @Post('/')
    async create(@Body() users: UsersDTO){
        await this.sendMailService.sendMail(users);
        return {status: "ok"}
    }
}
