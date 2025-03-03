import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ExamModule } from './exam/exam.module';
import { UserModule } from './user/user.module';
import { SubjectModule } from './subject/subject.module';
import { TopicModule } from './topic/topic.module';
import { QuestionModule } from './question/question.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: Joi.object({
        port: Joi.number().default(3000),
        database: {
          host: Joi.string().default('localhost'),
          port: Joi.number().default(5432),
          username: Joi.string(),
          password: Joi.string(),
          database: Joi.string(),
        },
        JWT_SECRET: Joi.string(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DatabaseModule,
    ExamModule,
    UserModule,
    SubjectModule,
    TopicModule,
    QuestionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
