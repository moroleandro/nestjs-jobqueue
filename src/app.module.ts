import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { SendMailProducerService } from './jobs/sendMail-producer-service';
import { SendMailConsumer } from './jobs/sendMail-consumer';
import { Queue } from 'bull';
import { MiddlewareBuilder } from '@nestjs/core';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.QUEUE_HOST,
        port: Number(process.env.QUEUE_PORT),
      }
    }),
    BullModule.registerQueue({
      name: "sendmail-queue",
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
  ],
  controllers: [UsersController],
  providers: [SendMailProducerService, SendMailConsumer],
})
export class AppModule {
  constructor(@InjectQueue("sendmail-queue") private sendMailQueue: Queue){}

  configure(consumer: MiddlewareBuilder){
    const { router } = createBullBoard([
      new BullAdapter(this.sendMailQueue)
    ]);
    consumer.apply(router).forRoutes("/admin/bull")
  }
}
