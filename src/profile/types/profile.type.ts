import { UserType } from 'src/user/user.type';

export type ProfileType = UserType & { following: boolean };
