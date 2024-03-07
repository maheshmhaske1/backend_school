// src/admin/admin.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
// import { AdminService } from './admin.service';
// import { AuthGuard } from './auth.guard';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminService } from './admin-user.service';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  async register(@Body() adminDto: AdminRegisterDto) {
    return this.adminService.register(adminDto);
  }

  @Post('login')
  async login(@Body() adminDto: AdminLoginDto) {
    console.log(adminDto)
    return this.adminService.login(adminDto);
  }

  @Post('secure-route')
  @UseGuards(AuthGuard)
  secureRoute() {
    return { message: 'This route is secure!' };
  }
}
