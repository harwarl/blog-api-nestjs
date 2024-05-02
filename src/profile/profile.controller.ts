import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UserD } from 'src/user/decorators/user.decorator';
import { IProfileResponse } from './types/profileResponse.interface';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(
    @UserD('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.getProfile(
      currentUserId,
      profileUsername,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followProfile(
    @UserD('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.followProfile(
      currentUserId,
      profileUsername,
    );
    return this.profileService.buildProfileResponse(profile);
  }

  @Post(':username/unfollow')
  @UseGuards(AuthGuard)
  async unfollowProfile(
    @UserD('id') currentUserId: number,
    @Param('username') profileUsername: string,
  ): Promise<IProfileResponse> {
    const profile = await this.profileService.unfollowProfile(
      currentUserId,
      profileUsername,
    );
    return this.profileService.buildProfileResponse(profile);
  }
}
