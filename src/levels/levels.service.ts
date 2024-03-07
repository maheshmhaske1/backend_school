import { Injectable } from '@nestjs/common';
import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Level } from './entities/level.entity';
import { Model } from 'mongoose';

@Injectable()
export class LevelsService {
  constructor(
    @InjectModel(Level.name) private readonly levelModel: Model<Level>,
  ) {}
  async create(createLevelDto: CreateLevelDto) {
    try {
      // check email already exits?
      const exists = await this.levelModel.findOne({
        name: createLevelDto.name,
        status:true
      });
      if (exists) {
        return {
          success: false,
          message: 'Level name already exists',
          data: [],
        };
      }

      // Create a new Teacher
      const newLevel = new this.levelModel(createLevelDto);
      const data = await newLevel.save();
      return {
        success: true,
        message: 'Level registered successfully',
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
      const data = await this.levelModel
        .find({ status: true })

        .exec();
      return {
        success: true,
        message: 'Level list',
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
      const data = await this.levelModel
        .findById(id)
        .exec();
      return {
        success: true,
        message: 'Level list by id',
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

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    try {
      // Find the Level by ID
      const Level = await this.levelModel
        .findByIdAndUpdate(id, updateLevelDto, { new: true })
        .exec();

      // If the Level is not found, throw NotFoundException
      if (!Level) {
        return {
          success: false,
          message: 'Level not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Level updated successfully...!',
        data: Level,
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
      // Find the Level by ID
      const Level = await this.levelModel
        .findByIdAndUpdate(id, { status: false }, { new: true })
        .exec();

      // If the Level is not found, throw NotFoundException
      if (!Level) {
        return {
          success: false,
          message: 'Level not found',
          data: [],
        };
      }
      return {
        success: true,
        message: 'Level deleted successfully...!',
        data: Level,
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
