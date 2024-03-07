import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student, StudentSchema } from './entities/student.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';


@Module({
  imports:[ MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]), JwtModule.register({
    secret: 'secret', 
    signOptions: { expiresIn: '1d' }, 
  }),],
  controllers: [StudentController],
  providers: [StudentService, JwtStrategy],
})
export class StudentModule {}
