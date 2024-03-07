import { Injectable } from '@nestjs/common';
import { CreateExamSubmissionDto } from './dto/create-exam-submission.dto';
import { UpdateExamSubmissionDto } from './dto/update-exam-submission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ExamQuestions } from 'src/exam/entities/exam-question';
import { ExamStudent } from 'src/exam/entities/exam-student';
import { Exam } from 'src/exam/entities/exam.entity';
import { Question } from 'src/question/entities/question.entity';
import { Student } from 'src/student/entities/student.entity';
import { ExamSubmission } from './entities/exam-submission.entity';


@Injectable()
export class ExamSubmissionService {
  constructor(
    @InjectModel(ExamSubmission.name) private readonly examSubmissionModel: Model<ExamSubmission>,

  ) { }
  async create(body) {
    console.log(body)
    try {

      // create exam submission
      body.map(async (data) => {
        await this.examSubmissionModel.create(data)
      })

      return {
        success: true,
        data: [],
        message: 'Exam submission created successfully',
      };
    }
    catch (err) {
      console.log(err)
      return {
        success: false,
        data: [],
        message: 'Exam submission not created',
      }
    }
  }

  findAll() {
    return `This action returns all examSubmission`;
  }

  findOne(id: string) {
    return `This action returns a #${id} examSubmission`;
  }

  //findByExaminationId
 async findByExaminationId(id: string) {
    // return `This action returns a #${id} examSubmission`;
    try {
      const data = await this.examSubmissionModel
        .aggregate([
          { $match: { status: true, examination_id: new Types.ObjectId(id) } },

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
              from: 'examstudents',
              localField: 'examination_id',
              foreignField: '_id',
              as: 'examination_id',
            },
          },
          {
            $unwind: {
              path: '$examination_id',
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

  update(id: number, updateExamSubmissionDto: UpdateExamSubmissionDto) {
    return `This action updates a #${id} examSubmission`;
  }

  remove(id: number) {
    return `This action removes a #${id} examSubmission`;
  }
}
