// src/admin/admin.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminRegisterDto } from './dto/admin-register.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { Admin } from './model/admin-user.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        private readonly jwtService: JwtService,
    ) { }

    async register(adminDto: AdminRegisterDto): Promise<any> {
    
        try {
            const existingAdmin = await this.adminModel.findOne({ email: adminDto.email });
            if (existingAdmin) {
                return {
                    success: false,
                    data: [],
                    message: 'Email already exists',
                };
            }

            const hashedPassword = await bcrypt.hash(adminDto.password, 10);
            const createdAdmin = new this.adminModel({
                username: adminDto.username,
                password: hashedPassword,
                admin_name: adminDto.admin_name,
                email: adminDto.email,
                number: adminDto.number,
            });

            await createdAdmin.save();

            return {
                success: true,
                data: [],
                message: 'Admin created successfully',
            };
        } catch (error) {
            return {
                success: false,
                data: [],
                message: 'Failed to create admin', error,
            };
        }
    }

    async login(adminDto: AdminLoginDto): Promise<any> {
        console.log(adminDto)
        try {
            const admin = await this.adminModel.findOne({ email: adminDto.email,status:true }).select('+password').exec();
            if (!admin || !(await bcrypt.compare(adminDto.password, admin.password))) {
                return {
                    success: false,
                    data: [],
                    message: 'Invalid username or password',
                };
            }

            const token = this.jwtService.sign({ sub: admin.id });
            const data =await  {
                name: admin.admin_name,
                id: admin._id,
                token: token
            }
            return {
                success: true,
                data: data,
                message: 'Admin login successfully',
            };

        } catch (error) {
            console.log(error)
            return {
                success: false,
                data: [],
                message: 'Invalid username or password',
            };
        }
    }
}

