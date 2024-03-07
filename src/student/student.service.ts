import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from './entities/student.entity';
import * as bcrypt from 'bcrypt';
import { sendEmail } from 'src/auth/email.helper';
import { StudentLoginDto } from './dto/login-student.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    try {
      // check email already exits?
      const exists = await this.studentModel.findOne({
        email: createStudentDto.email,
        status: true,
      });
      if (exists) {
        return {
          success: false,
          message: 'Email already exists..',
          data: [],
        };
      }

   

      //checking Created by
      if (createStudentDto.created_type == 'Admin') {
        createStudentDto.admin_id = createStudentDto.created_id;
      } else {
        createStudentDto.teacher_id = createStudentDto.created_id;
      }

       // generate password
       let password = "student123"
      
       // Hash the password
       const hashedPassword = await bcrypt.hash(password, 10);
       createStudentDto.password = hashedPassword;

      // Create a new newStudent
      const newStudent = new this.studentModel(createStudentDto);
      const data = await newStudent.save();

      sendEmail(createStudentDto.email, 'Welcome to Our Organization!', `<html>
      <body>
      <p>Dear ${createStudentDto.name},</p>
      
      <p>Welcome to Vidyam Group! We are excited to have you join us.</p>
      
      <p>Your account has been created successfully. Here are your login details:</p>
      
      <p>Email: ${createStudentDto.email}<br>
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
        message: 'Student registered successfully',
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
      const data = await this.studentModel
        .aggregate([
          { $match: { status: true } },
          {
            $lookup: {
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $addFields: {
              teacher_id: {
                $ifNull: [{ $arrayElemAt: ['$teacher_id', 0] }, null],
              },
            },
          },
          {
            $lookup: {
              from: 'admins',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'admin_id',
            },
          },
          {
            $unwind: {
              path: '$admin_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'organizations',
              localField: 'organization_id',
              foreignField: '_id',
              as: 'organization_id',
            },
          },
          {
            $unwind: {
              path: '$organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'levels',
              localField: 'level_id',
              foreignField: '_id',
              as: 'level_id',
            },
          },
          {
            $unwind: {
              path: '$level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: '$_id', // Group by the student's _id
              name: { $first: '$name' }, // Use $first to get the original value
              roll_no: { $first: '$roll_no' },
              created_type: { $first: '$created_type' },
              email: { $first: '$email' },
              mobile_number: { $first: '$mobile_number' },
              organization_id: { $first: '$organization_id' },
              level_id: { $first: '$level_id' },
              teacher_id: { $first: '$teacher_id' },
              admin_id: { $first: '$admin_id' },
              status: { $first: '$status' },
            },
          },
        ])
        .exec();
      return {
        success: true,
        message: 'Student list',
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
      const data = await this.studentModel
        .aggregate([
          { $match: { _id: new Types.ObjectId(id) } },
          {
            $lookup: {
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $addFields: {
              teacher_id: {
                $ifNull: [{ $arrayElemAt: ['$teacher_id', 0] }, null],
              },
            },
          },
          {
            $lookup: {
              from: 'admins',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'admin_id',
            },
          },
          {
            $unwind: {
              path: '$admin_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'organizations',
              localField: 'organization_id',
              foreignField: '_id',
              as: 'organization_id',
            },
          },
          {
            $unwind: {
              path: '$organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'levels',
              localField: 'level_id',
              foreignField: '_id',
              as: 'level_id',
            },
          },
          {
            $unwind: {
              path: '$level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: '$_id', // Group by the student's _id
              name: { $first: '$name' }, // Use $first to get the original value
              roll_no: { $first: '$roll_no' },
              email: { $first: '$email' },
              created_type: { $first: '$created_type' },
              mobile_number: { $first: '$mobile_number' },
              organization_id: { $first: '$organization_id' },
              level_id: { $first: '$level_id' },
              teacher_id: { $first: '$teacher_id' },
              admin_id: { $first: '$admin_id' },
              status: { $first: '$status' },
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Student details by ID',
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

  async findByOrganization(id: string) {
    try {
      const data = await this.studentModel
        .aggregate([
          { $match: { organization_id: new Types.ObjectId(id), status: true } },
          {
            $lookup: {
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $addFields: {
              teacher_id: {
                $ifNull: [{ $arrayElemAt: ['$teacher_id', 0] }, null],
              },
            },
          },
          {
            $lookup: {
              from: 'admins',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'admin_id',
            },
          },
          {
            $unwind: {
              path: '$admin_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'organizations',
              localField: 'organization_id',
              foreignField: '_id',
              as: 'organization_id',
            },
          },
          {
            $unwind: {
              path: '$organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'levels',
              localField: 'level_id',
              foreignField: '_id',
              as: 'level_id',
            },
          },
          {
            $unwind: {
              path: '$level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: '$_id', // Group by the student's _id
              name: { $first: '$name' }, // Use $first to get the original value
              roll_no: { $first: '$roll_no' },
              email: { $first: '$email' },
              created_type: { $first: '$created_type' },
              mobile_number: { $first: '$mobile_number' },
              organization_id: { $first: '$organization_id' },
              level_id: { $first: '$level_id' },
              teacher_id: { $first: '$teacher_id' },
              admin_id: { $first: '$admin_id' },
              status: { $first: '$status' },
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Student details by organization ID',
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

  
  async findByLevel(id: string) {
    try {
      const data = await this.studentModel
        .aggregate([
          { $match: { level_id: new Types.ObjectId(id) } },
          {
            $lookup: {
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $addFields: {
              teacher_id: {
                $ifNull: [{ $arrayElemAt: ['$teacher_id', 0] }, null],
              },
            },
          },
          {
            $lookup: {
              from: 'admins',
              localField: 'admin_id',
              foreignField: '_id',
              as: 'admin_id',
            },
          },
          {
            $unwind: {
              path: '$admin_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'organizations',
              localField: 'organization_id',
              foreignField: '_id',
              as: 'organization_id',
            },
          },
          {
            $unwind: {
              path: '$organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'levels',
              localField: 'level_id',
              foreignField: '_id',
              as: 'level_id',
            },
          },
          {
            $unwind: {
              path: '$level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: '$_id', // Group by the student's _id
              name: { $first: '$name' }, // Use $first to get the original value
              roll_no: { $first: '$roll_no' },
              email: { $first: '$email' },
              created_type: { $first: '$created_type' },
              mobile_number: { $first: '$mobile_number' },
              organization_id: { $first: '$organization_id' },
              level_id: { $first: '$level_id' },
              teacher_id: { $first: '$teacher_id' },
              admin_id: { $first: '$admin_id' },
              status: { $first: '$status' },
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Student details by level ID',
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

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      //checking Created by
      if (updateStudentDto.created_type == 'Admin') {
        updateStudentDto.admin_id = updateStudentDto.created_id;
      } else {
        updateStudentDto.teacher_id = updateStudentDto.created_id;
      }

      // Find the Student by ID
      const Student = await this.studentModel
        .findByIdAndUpdate(id, updateStudentDto, { new: true })
        .exec();

      // If the Student is not found, throw NotFoundException
      if (!Student) {
        return {
          success: false,
          message: 'Student not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Student updated successfully...!',
        data: Student,
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
      // Find the Student by ID
      const Student = await this.studentModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Student is not found, throw NotFoundException
      if (!Student) {
        return {
          success: false,
          message: 'Student not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Student deleted successfully...!',
        data: Student,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async studentLogin(loginDto: StudentLoginDto): Promise<any> {
    try {
      const student = await this.studentModel.findOne({
        email: loginDto.email,
        status:true
      }).select('+password').exec();

      if (
        !student ||
        !(await bcrypt.compare(loginDto.password, student.password))
      ) {
        return {
          success: false,
          data: [],
          message: 'Invalid username or password',
        };
      }

      student.password = undefined;
      const token = this.jwtService.sign({ sub: student.id });
      const data = await {
        studentData: student,
        token: token,
      };
      return {
        success: true,
        data: data,
        message: 'Student login successfully',
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
