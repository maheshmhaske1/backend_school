import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminUserModule } from './admin-user/admin-user.module';
import { OrganizationModule } from './organization/organization.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TeacherModule } from './teacher/teacher.module';
import { LevelsModule } from './levels/levels.module';
import { StudentModule } from './student/student.module';
import { QuestionModule } from './question/question.module';
import { ExamModule } from './exam/exam.module';
import { ExamSubmissionModule } from './exam-submission/exam-submission.module';



@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGO_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    AdminUserModule,
    OrganizationModule,
    TeacherModule,
    LevelsModule,
    StudentModule,
    QuestionModule,
    ExamModule,
    ExamSubmissionModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
