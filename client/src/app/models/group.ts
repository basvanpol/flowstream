import { IIcon } from './icon';
export interface GroupVM {
  _id: string;
  title: string;
  _user: string;
  icon: IIcon;
  canUserEdit?: boolean;
}
