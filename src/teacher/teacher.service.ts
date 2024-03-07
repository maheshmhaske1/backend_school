import { Injectable } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from './entities/teacher.entity';
import * as bcrypt from 'bcrypt';
import { TeacherLoginDto } from './dto/login-teacher.dto';
import { JwtService } from '@nestjs/jwt';
import { sendEmail } from 'src/auth/email.helper';


@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createTeacherDto: CreateTeacherDto) {
    try {
      // check email already exits?
      const exists = await this.teacherModel.findOne({ email: createTeacherDto.email, status: true });
      if (exists) {
        return {
          success: false,
          message: 'Email already exists',
          data: [],
        };
      }

      // generate password
      const password = "teacher123"
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      createTeacherDto.password = hashedPassword;

      // Create a new Teacher
      const newTeacher = new this.teacherModel(createTeacherDto);
      const data = await newTeacher.save();
      sendEmail(createTeacherDto.email, 'Welcome to Our Organization!', `<html>
      <body>
      <p>Dear ${createTeacherDto.name},</p>
      
      <p>Welcome to Vidyam Group! We are excited to have you join us.</p>
      
      <p>Your account has been created successfully. Here are your login details:</p>
      
      <p>Email: ${createTeacherDto.email}<br>
      Password: ${password}</p>
      
      <p>Please use the following URL to log in to your account:</p>
      
      <p><a href="http://localhost:3000/admin-login">Login</a></p>
      
      <p>If you have any questions or need assistance, please feel free to contact us:</p>
      
      <p>Email: information@gmail.com<br>
      Contact Number: <a href="tel:1234567890">1234567890</a></p>
      
      <p>Best regards,<br>
      Vidyam Group</p>
      </body>
      </html>
      `)
      return {
        success: true,
        message: 'Teacher registered successfully',
        data: [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async findAll() {
    try {
      const data = await this.teacherModel
        .find({ status: true })
        .populate('organization_id')
        .exec();
      return {
        success: true,
        message: 'Teacher list',
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.teacherModel
        .findById(id)
        .populate('organization_id')
        .exec();
      return {
        success: true,
        message: 'Teacher list by id',
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async findByOrganizationId(id: string) {
    try {
      const data = await this.teacherModel
        .find({ organization_id: id, status: true })
        .populate('organization_id')
        .exec();
      return {
        success: true,
        message: 'Teacher list by id',
        data: data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    try {
      // Find the Teacher by ID
      const Teacher = await this.teacherModel
        .findByIdAndUpdate(id, updateTeacherDto, { new: true })
        .exec();

      // If the Teacher is not found, throw NotFoundException
      if (!Teacher) {
        return {
          success: false,
          message: 'Teacher not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Teacher updated successfully...!',
        data: Teacher,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async remove(id: string) {
    try {
      // Find the Teacher by ID
      const Teacher = await this.teacherModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Teacher is not found, throw NotFoundException
      if (!Teacher) {
        return {
          success: false,
          message: 'Teacher not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Teacher deleted successfully...!',
        data: Teacher,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async teacherLogin(loginDto: TeacherLoginDto): Promise<any> {
    try {
      const teacher = await this.teacherModel.findOne({
        email: loginDto.email,
        status:true
      }).select('+password').exec();
      if (
        !teacher ||
        !(await bcrypt.compare(loginDto.password, teacher.password))
      ) {
        return {
          success: false,
          data: [],
          message: 'Invalid username or password',
        };
      }

      teacher.password = undefined;
      const token = this.jwtService.sign({ sub: teacher.id });
      const data = await {
        teacherData: teacher,
        token: token,
      };
      return {
        success: true,
        data: data,
        message: 'Teacher login successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Invalid username or password',
      };
    }
  }
}
