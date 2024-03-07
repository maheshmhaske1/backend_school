// admin-user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin-user.controller';
import { AdminSchema } from './model/admin-user.model';
import { AdminService } from './admin-user.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Admin', schema: AdminSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret', 
      signOptions: { expiresIn: '1d' }, 
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
})
export class AdminUserModule {}
