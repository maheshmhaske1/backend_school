import { Module } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { LevelsController } from './levels.controller';
import { Level, LevelSchema } from './entities/level.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[MongooseModule.forFeature([{ name: Level.name, schema: LevelSchema }])],
  controllers: [LevelsController],
  providers: [LevelsService],
})
export class LevelsModule {}
