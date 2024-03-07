import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) { }

  async create(createQuestionDto: CreateQuestionDto) {
    try {
      // check email already exits?
      const exists = await this.questionModel.findOne({
        question: createQuestionDto.question,
        status: true,
      });
      if (exists) {
        return {
          success: false,
          message: 'Question  already exists',
          data: [],
        };
      }

      // Create a new newStudent
      const newQuestion = new this.questionModel(createQuestionDto);
      const data = await newQuestion.save();
      return {
        success: true,
        message: 'Question registered successfully',
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

  //createBulk
  async createBulk(body) {
    console.log("body", body)
    try {
        let exitData = []
        for (const item of body) {
            const exists = await this.questionModel.findOne({
                question: item.question,
                status: true,
            });
            if (exists) {
                exitData.push(item)
            } else {
                const newQuestion = new this.questionModel(item);
                const data = await newQuestion.save();
            }
        }

        let message = "Question registered successfully"
        if(exitData.length>0){
          message = `Question registered successfully, But ${exitData.length} questions already exists, Remains question added successfully...`
        }

        return {
            success: true,
            message: message,
            data: []
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
      const data = await this.questionModel
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
            $group: {
              _id: '$_id',
              question: { $first: '$question' },
              is_type: { $first: '$is_type' },
              img_url: { $first: '$img_url' },
              is_final: { $first: '$is_final' },
              options: { $first: '$options' },
              answer: { $first: '$answer' },
              created_by: { $first: '$created_by' },
              level_id: { $first: '$level_id' },
              status: { $first: '$status' },
              createdAt: { $first: '$createdAt' },

            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Question list',
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

  // findAllByLevel
  async findAllByLevel(id) {
    try {
      const data = await this.questionModel
        .aggregate([
          { $match: { status: true, level_id: new Types.ObjectId(id) } },

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
            $group: {
              _id: '$_id',
              question: { $first: '$question' },
              is_type: { $first: '$is_type' },
              img_url: { $first: '$img_url' },
              is_final: { $first: '$is_final' },
              options: { $first: '$options' },
              answer: { $first: '$answer' },
              created_by: { $first: '$created_by' },
              level_id: { $first: '$level_id' },
              status: { $first: '$status' },
              createdAt: { $first: '$createdAt' },

            },
          },
        ])
        .exec();

      return {
        success: true,
        message: 'Question list',
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
      const data = await this.questionModel
        .aggregate([
          { $match: { _id: new Types.ObjectId(id) } },

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
            $group: {
              _id: '$_id',
              question: { $first: '$question' },
              is_type: { $first: '$is_type' },
              img_url: { $first: '$img_url' },
              is_final: { $first: '$is_final' },
              options: { $first: '$options' },
              answer: { $first: '$answer' },
              created_by: { $first: '$created_by' },
              level_id: { $first: '$level_id' },
              status: { $first: '$status' },
            },
          },
        ])
        .exec();
      return {
        success: true,
        message: 'Question list',
        data: data[0],
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    try {
      // Find the Question by ID
      const Question = await this.questionModel
        .findByIdAndUpdate(id, updateQuestionDto, { new: true })
        .exec();

      // If the Question is not found, throw NotFoundException
      if (!Question) {
        return {
          success: false,
          message: 'Question not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Question updated successfully...!',
        data: Question,
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
      // Find the Question by ID
      const Question = await this.questionModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Question is not found, throw NotFoundException
      if (!Question) {
        return {
          success: false,
          message: 'Question not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Question deleted successfully...!',
        data: Question,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  }
}
