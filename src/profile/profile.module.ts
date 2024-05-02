import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { ProfileService } from './profile.service';
import { Follow } from './follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
