import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { Teacher, TeacherSchema } from './entities/teacher.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: TeacherSchema }]),
    JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  controllers: [TeacherController],
  providers: [TeacherService, JwtStrategy],
})
export class TeacherModule {}
