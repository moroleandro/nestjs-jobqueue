import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UsersDTO } from 'src/users/users-dto';

@Injectable()
class SendMailProducerService {
    constructor(@InjectQueue("sendmail-queue") private queue: Queue){}

    async sendMail(users: UsersDTO) {
        await this.queue.add("sendmail-job", users, {
            delay: 5000
        });
    }
}

export { SendMailProducerService }