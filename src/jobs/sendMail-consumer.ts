import { MailerService } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueProgress, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { time } from 'console';
import { UsersDTO } from 'src/users/users-dto';

@Processor("sendmail-queue")
class SendMailConsumer {
    constructor(private mailService: MailerService){}
    
    @Process("sendmail-job")
    async sendMailJob(job: Job<UsersDTO>){
        const { data } = job;
        await this.mailService.sendMail({
            to: data.email,
            from: "Team JobQueue <contact@teamjobqueue.com>",
            subject: `Welcome ${data.name}`,
            text: `Hello ${data.name}, we are very happy with your subscription!\nThis you mail: ${data.email}`
        })
    }

    @OnQueueCompleted()
    onCompleted(job: Job){
        console.log( new Date().getTime(), ` - On completed ${job.name}`);
    }

    @OnQueueProgress()
    onProgress(job: Job){
        console.log( new Date().getTime(), ` - Progress message ${job.name}`);
    }

    @OnQueueActive()
    onActive(job: Job){
        console.log(new Date().getTime(), ` - On queue active ${job.name}`)
    }
}

export { SendMailConsumer }