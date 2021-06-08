import { MailerService } from '@nestjs-modules/mailer';
import { Body, Controller, Post } from '@nestjs/common';
import { UsersDTO } from './users-dto';

@Controller('users')
export class UsersController {
    constructor(private mailService: MailerService){}

    @Post('/')
    async create(@Body() user: UsersDTO){
        await this.mailService.sendMail({
            to: user.email,
            from: "Team JobQueue <contact@teamjobqueue.com>",
            subject: `Welcome ${user.name}`,
            text: `Hello <b>${user.name}</b>, we are very happy with your subscription!`
        });
        return {status: "ok"}
    }
}
