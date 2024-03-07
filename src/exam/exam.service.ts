import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Exam } from './entities/exam.entity';
import { Model, Types } from 'mongoose';
import { ExamStudent } from './entities/exam-student';
import { Student } from 'src/student/entities/student.entity';
import { CreateExamStudentDto } from './dto/create-exam-student.dto';
import { ExamQuestions } from './entities/exam-question';
import { Question } from 'src/question/entities/question.entity';
import { CreateExamQuestiontDto } from './dto/create-exam-question.dto';
import { query } from 'express';
import { Organization } from 'src/organization/entities/organization.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';




@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private readonly examModel: Model<Exam>,
    @InjectModel(ExamStudent.name) private readonly examStudentModel: Model<ExamStudent>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(ExamQuestions.name) private readonly examQuestionsModel: Model<ExamQuestions>,
    @InjectModel(Question.name) private readonly questionsModel: Model<Question>,
    @InjectModel(Organization.name) private readonly organizationModel: Model<Organization>,
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,

  ) { }

  async create(createExamDto: CreateExamDto) {
    try {
      // Check if an exam with the same date and time, organization, and level already exists
      const existingExam = await this.examModel.findOne({
        examDateTime: createExamDto.examDateTime,
        examEndDateTime: createExamDto.examEndDateTime,
        organization_id: createExamDto.organization_id,
        level_id: createExamDto.level_id,
        status: true,
      });

      if (existingExam) {
        return {
          success: false,
          message: 'Exam with same time already exists...!',
          data: [],
        };
      }
      // Create a new Exam
      const newExam = new this.examModel(createExamDto);
      const data = await newExam.save();

      // Create exam student
      const studentData = this.studentModel.find({ status: true, organization_id: createExamDto.organization_id, level_id: createExamDto.level_id }).exec();
      if (studentData) {
        (await studentData).map(async (student) => {
          const examStudent = new this.examStudentModel({
            exam_id: data._id,
            student_id: student._id,
          });
          await examStudent.save();
        })
      }

      // Create exam question
      const questionData = this.questionsModel.find({ status: true, level_id: createExamDto.level_id, is_final: true }).limit(data.total_marks).exec();
      if (questionData) {
        (await questionData).map(async (question) => {
          const examQuestion = new this.examQuestionsModel({
            exam_id: data._id,
            question_id: question._id,
          });
          await examQuestion.save();
        })
      }

      return {
        success: true,
        message: 'Exam created successfully',
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
      const data = await this.examModel
        .aggregate([
          { $match: { status: true } },

          {
            $lookup: {
              from: 'admins',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by',
            },
          },
          {
            $unwind: {
              path: '$created_by',
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
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $unwind: {
              path: '$teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Exam list',
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

  async findOne(id) {
    try {
      const data = await this.examModel
        .aggregate([
          { $match: { status: true, _id: new Types.ObjectId(id) } },

          {
            $lookup: {
              from: 'admins',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by',
            },
          },
          {
            $unwind: {
              path: '$created_by',
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
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $unwind: {
              path: '$teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Exam list by id',
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

  // findByOrganizationId
  async findByOrganizationId(id) {
    try {
      const data = await this.examModel
        .aggregate([
          { $match: { status: true, organization_id: new Types.ObjectId(id), is_schedule:true } },

          {
            $lookup: {
              from: 'admins',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by',
            },
          },
          {
            $unwind: {
              path: '$created_by',
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
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $unwind: {
              path: '$teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Exam list by id',
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

  //findByOrganizationLevel
  async findByOrganizationLevel(body) {
    try {
      const data = await this.examModel
        .aggregate([
          {
            $match: {
              status: true,
              organization_id: new Types.ObjectId(body.organization_id),
              level_id: new Types.ObjectId(body.level_id),
            },
          },

          {
            $lookup: {
              from: 'admins',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by',
            },
          },
          {
            $unwind: {
              path: '$created_by',
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
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $unwind: {
              path: '$teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Exam list by id',
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

  async update(id, updateExamDto: UpdateExamDto) {
    try {

      // Find the Exam by ID
      const Exam = await this.examModel
        .findByIdAndUpdate(id, updateExamDto, { new: true })
        .exec();

      // If the Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam updated successfully...!',
        data: Exam,
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
      // Find the Exam by ID
      const Exam = await this.examModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam deleted successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //addExamStudent
  async addExamStudent(CreateExamStudentDto: CreateExamStudentDto) {
    try {

      const existingExamStudent = await this.examStudentModel.findOne({
        exam_id: CreateExamStudentDto.exam_id,
        student_id: CreateExamStudentDto.student_id,
        status: true,
      })

      if (existingExamStudent) {
        return {
          success: false,
          message: 'Student already added to exam',
          data: [],
        };
      }

      // Create a new Exam Student
      const newExam = new this.examStudentModel(CreateExamStudentDto);
      const data = await newExam.save();

      return {
        success: true,
        message: 'Student added to exam successfully',
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

  // getExamStudentByExamId
  async getExamStudentByExamId(id: string) {

    try {
      const data = await this.examStudentModel
        .aggregate([
          { $match: { status: true, exam_id: new Types.ObjectId(id) } },

          {
            $lookup: {
              from: 'students',
              localField: 'student_id',
              foreignField: '_id',
              as: 'student_id',
            },
          },
          {
            $unwind: {
              path: '$student_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'exam_id',
              foreignField: '_id',
              as: 'exam_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'admins',
              localField: 'exam_id.created_by',
              foreignField: '_id',
              as: 'exam_id.created_by',
            },
          },
          {
            $unwind: {
              path: '$exam_id.created_by',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'levels',
              localField: 'exam_id.level_id',
              foreignField: '_id',
              as: 'exam_id.level_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'organizations',
              localField: 'exam_id.organization_id',
              foreignField: '_id',
              as: 'exam_id.organization_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'teachers',
              localField: 'exam_id.teacher_id',
              foreignField: '_id',
              as: 'exam_id.teacher_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { exam_score: -1 },
          }

        ])
        .exec();

      return {
        success: true,
        message: 'Exam list',
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

  //getExamStudentById
  async getExamStudentById(id: string) {

    try {
      const data = await this.examStudentModel
        .aggregate([
          { $match: { status: true, _id: new Types.ObjectId(id) } },

          {
            $lookup: {
              from: 'students',
              localField: 'student_id',
              foreignField: '_id',
              as: 'student_id',
            },
          },
          {
            $unwind: {
              path: '$student_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'exam_id',
              foreignField: '_id',
              as: 'exam_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'admins',
              localField: 'exam_id.created_by',
              foreignField: '_id',
              as: 'exam_id.created_by',
            },
          },
          {
            $unwind: {
              path: '$exam_id.created_by',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'levels',
              localField: 'exam_id.level_id',
              foreignField: '_id',
              as: 'exam_id.level_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'organizations',
              localField: 'exam_id.organization_id',
              foreignField: '_id',
              as: 'exam_id.organization_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'teachers',
              localField: 'exam_id.teacher_id',
              foreignField: '_id',
              as: 'exam_id.teacher_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $sort: { exam_score: 1 },
          }
        ])
        .exec();

      return {
        success: true,
        message: 'Exam list',
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

  //getExamByStudentId
  async getExamByStudentId(body) {

    try {

      const currentTime = new Date();
      // Assuming 'upcoming' or 'recent' is passed in the 'type' property of the 'body' object
      const customQuery =
        body.type === 'upcoming' ? { $gt: currentTime } : { $lt: currentTime };

      const data = await this.examStudentModel.aggregate([
        { $match: { status: true, student_id: new Types.ObjectId(body.student_id) } },
        {
          $lookup: {
            from: 'students',
            localField: 'student_id',
            foreignField: '_id',
            as: 'student_id',
          },
        },
        {
          $unwind: {
            path: '$student_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'exams',
            localField: 'exam_id',
            foreignField: '_id',
            as: 'exam_id',
          },
        },
        {
          $unwind: {
            path: '$exam_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'admins',
            localField: 'exam_id.created_by',
            foreignField: '_id',
            as: 'exam_id.created_by',
          },
        },
        {
          $unwind: {
            path: '$exam_id.created_by',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'levels',
            localField: 'exam_id.level_id',
            foreignField: '_id',
            as: 'exam_id.level_id',
          },
        },
        {
          $unwind: {
            path: '$exam_id.level_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'organizations',
            localField: 'exam_id.organization_id',
            foreignField: '_id',
            as: 'exam_id.organization_id',
          },
        },
        {
          $unwind: {
            path: '$exam_id.organization_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'teachers',
            localField: 'exam_id.teacher_id',
            foreignField: '_id',
            as: 'exam_id.teacher_id',
          },
        },
        {
          $unwind: {
            path: '$exam_id.teacher_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $match: { $and: [{ 'exam_id.examEndDateTime': customQuery }, { 'exam_id.is_schedule': true }, { 'exam_id.status': true }] } },
      ]).exec();

      return {
        success: true,
        message: 'Exam list for student',
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


  //removeStudentFromExam
  async removeStudentFromExam(id: string) {
    try {
      // Find the Exam by ID
      const Exam = await this.examStudentModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Student not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Student removed successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }


  //addExamQestion
  async addExamQuestion(CreateExamQuestionDto: CreateExamQuestiontDto) {
    try {

      const examData = await this.examModel.findById({ _id: CreateExamQuestionDto.exam_id, status: true }).exec();
      const questionCount = await this.examQuestionsModel.countDocuments({ exam_id: CreateExamQuestionDto.exam_id, status: true }).exec();

      if (examData?.total_marks <= questionCount) {
        return {
          success: false,
          message: 'Required question already added, you can not add more questions to exam, if you want to add more questions you can remove some questions from exam',
          data: [],
        }
      }

      const existingExamQuestion = await this.examQuestionsModel.findOne({
        exam_id: CreateExamQuestionDto.exam_id,
        question_id: CreateExamQuestionDto.question_id,
        status: true,
      })

      if (existingExamQuestion) {
        return {
          success: false,
          message: 'Question already added to exam',
          data: [],
        };
      }

      // Create a new Exam Question
      const newExam = new this.examQuestionsModel(CreateExamQuestionDto);
      const data = await newExam.save();

      return {
        success: true,
        message: 'Question added to exam successfully',
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

  // getExamQuestionByExamId
  async getExamQuestiontByExamId(id: string) {

    try {
      const data = await this.examQuestionsModel
        .aggregate([
          { $match: { status: true, exam_id: new Types.ObjectId(id) } },

          {
            $lookup: {
              from: 'questions',
              localField: 'question_id',
              foreignField: '_id',
              as: 'question_id',
            },
          },
          {
            $unwind: {
              path: '$question_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'exam_id',
              foreignField: '_id',
              as: 'exam_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'admins',
              localField: 'exam_id.created_by',
              foreignField: '_id',
              as: 'exam_id.created_by',
            },
          },
          {
            $unwind: {
              path: '$exam_id.created_by',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'levels',
              localField: 'exam_id.level_id',
              foreignField: '_id',
              as: 'exam_id.level_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.level_id',
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $lookup: {
              from: 'organizations',
              localField: 'exam_id.organization_id',
              foreignField: '_id',
              as: 'exam_id.organization_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.organization_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'teachers',
              localField: 'exam_id.teacher_id',
              foreignField: '_id',
              as: 'exam_id.teacher_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id.teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Exam qestion list',
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

  //getExamPracticeQuestionByExamId
  async getExamPracticeQuestionByExamId(id: string) {

    try {
      const examData = await this.examModel
        .aggregate([
          { $match: { status: true, _id: new Types.ObjectId(id) } },

          {
            $lookup: {
              from: 'admins',
              localField: 'created_by',
              foreignField: '_id',
              as: 'created_by',
            },
          },
          {
            $unwind: {
              path: '$created_by',
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
              from: 'teachers',
              localField: 'teacher_id',
              foreignField: '_id',
              as: 'teacher_id',
            },
          },
          {
            $unwind: {
              path: '$teacher_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      const levelId = examData[0].level_id._id
      const questionCount = examData[0].total_marks

      const questionData = await this.questionsModel.aggregate([
        { $match: { level_id: levelId, is_final: false, status: true } },
        { $sample: { size: questionCount } }
      ]).exec();

      let data = []
      questionData.map(async (question) => {
        data.push({
          exam_id: examData[0],
          question_id: question
        })
      })
      return {
        success: true,
        message: 'Exam question for practice',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //removeQuestionFromExam
  async removeQuestionFromExam(id: string) {
    try {
      // Find the Exam by ID
      const Exam = await this.examQuestionsModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Qestion not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Qestion removed successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //findStudentByOrganizationForExamNotExist
  async findStudentByOrganizationForExamNotExist(data) {
    try {
      let studentData = await this.examStudentModel
        .aggregate([
          { $match: { status: true, exam_id: new Types.ObjectId(data.exam_id) } },

          {
            $lookup: {
              from: 'students',
              localField: 'student_id',
              foreignField: '_id',
              as: 'student_id',
            },
          },
          {
            $unwind: {
              path: '$student_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'exam_id',
              foreignField: '_id',
              as: 'exam_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      let allStudent = await this.studentModel
        .aggregate([
          { $match: { organization_id: new Types.ObjectId(data.org_id), status: true } },

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

        ])
        .exec();

      const finalOutput = allStudent.map((student) => {
        const index = studentData.findIndex((item) => item.student_id._id.toString() === student._id.toString());
        if (index === -1) {
          return student;
        } else {
          return null; // Return null for exclusion
        }
      }).filter(item => item !== null); // Filter out null values


      return {
        success: true,
        message: 'Exam question list',
        data: finalOutput,
      }

    } catch (error) {
      console.log("error", error)
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //findQuestionForExamNotExist
  async findQuestionForExamNotExist(data) {
    try {
      let questionData = await this.examQuestionsModel
        .aggregate([
          { $match: { status: true, exam_id: new Types.ObjectId(data.exam_id) } },

          {
            $lookup: {
              from: 'questions',
              localField: 'question_id',
              foreignField: '_id',
              as: 'question_id',
            },
          },
          {
            $unwind: {
              path: '$question_id',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'exams',
              localField: 'exam_id',
              foreignField: '_id',
              as: 'exam_id',
            },
          },
          {
            $unwind: {
              path: '$exam_id',
              preserveNullAndEmptyArrays: true,
            },
          },
        ])
        .exec();

      let allQuestion = await this.questionsModel
        .aggregate([
          { $match: { level_id: new Types.ObjectId(data.level_id), status: true, is_final: true } },

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

        ])
        .exec();

      const finalOutput = allQuestion.map((question) => {
        const index = questionData.findIndex((item) => item.question_id._id.toString() === question._id.toString());
        if (index === -1) {
          return question;
        } else {
          return null; // Return null for exclusion
        }
      }).filter(item => item !== null); // Filter out null values


      return {
        success: true,
        message: 'Exam question does not exits',
        data: finalOutput

      }

    } catch (error) {
      console.log("error", error)
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //scheduleExam
  async scheduleExam(id: string) {
    try {
      // Find the Exam by ID
      const Exam = await this.examModel
        .findByIdAndUpdate(id, { is_schedule: true }, { new: true })
        .exec();

      // If the Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam scheduled successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //updateStudentData
  async updateStudentData(body) {
    try {

      // Create a new Exam
      const updateExamDto = {
        correct_questions: body.correct_questions,
        exam_score: body.exam_score,
        total_questions: body.total_questions,
        wrong_questions: body.wrong_questions,
        is_completed: true
      }

      // Find the Exam by ID
      const Exam = await this.examStudentModel
        .findByIdAndUpdate(body.exam_student_id, updateExamDto, { new: true })
        .exec();

      // If the Student Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam updated successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async updateStudentCertificate(body) {
    try {

      // Create a new Exam
      const updateExamDto = {
        exam_certificate: body.image,
      }

      // Find the Exam by ID
      const Exam = await this.examStudentModel
        .findByIdAndUpdate(body.examination_id, updateExamDto, { new: true })
        .exec();

      // If the Student Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam image updated successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async updateStudentCertificateGenerate(id) {
    try {

      // Create a new Exam
      const updateExamDto = {
        is_generated: true,
      }

      // Find the Exam by ID
      const Exam = await this.examModel
        .findByIdAndUpdate(id, updateExamDto, { new: true })
        .exec();

      // If the Student Exam is not found, throw NotFoundException
      if (!Exam) {
        return {
          success: false,
          message: 'Exam not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Exam generate updated successfully...!',
        data: Exam,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  //recentData
  async recentData(): Promise<any> {
    try {
      //recent organizations
      const orgData = await this.organizationModel.find({ status: true }).sort({ createdAt: -1 }).limit(5).exec();
      const orgCount = await this.organizationModel.find({ status: true }).countDocuments().exec();

      //recent teacher
      const teacherData = await this.teacherModel.find({ status: true }).populate('organization_id').sort({ createdAt: -1 }).limit(5).exec();
      const teacherCount = await this.teacherModel.find({ status: true }).countDocuments().exec();

      //recent student
      const studentData = await this.studentModel
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
          { $sort: { _id: -1 } }, // Sort by _id in descending order
          { $limit: 5 }, // Limit the result to the last five documents

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
      const studentCount = await this.studentModel.find({ status: true }).countDocuments().exec();

      // recent exam
      const examData =  await this.examModel
      .aggregate([
        { $match: { status: true } },

        {
          $lookup: {
            from: 'admins',
            localField: 'created_by',
            foreignField: '_id',
            as: 'created_by',
          },
        },
        {
          $unwind: {
            path: '$created_by',
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
            from: 'teachers',
            localField: 'teacher_id',
            foreignField: '_id',
            as: 'teacher_id',
          },
        },
        {
          $unwind: {
            path: '$teacher_id',
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { _id: -1 } }, // Sort by _id in descending order
        { $limit: 5 }, // Limit the result to the last five documents

      ])
      .exec();
      const examCount = await this.examModel.find({ status: true }).countDocuments().exec();


      const data = {
        orgData: orgData,
        orgCount: orgCount,
        teacherData: teacherData,
        teacherCount: teacherCount,
        studentData: studentData,
        studentCount: studentCount,
        examData: examData,
        examCount: examCount
      }
      // recent teacher
      return {
        success: true,
        message: "Organization list",
        data: data,

      }

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }

    }

  }
}

