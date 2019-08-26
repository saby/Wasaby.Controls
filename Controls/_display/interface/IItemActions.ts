import { Model } from 'Types/entity';

export enum ShowType {
   MENU,
   MENU_TOOLBAR,
   TOOLBAR
}

export interface IItemAction {
   id?: unknown;
   showType?: ShowType;
   title?: string;
   style?: string;
   icon?: string;
   iconStyle?: 'secondary' | 'warning' | 'danger' | 'success';
   handler?: (item: Model) => void;
   _isMenu?: boolean;
}

export default interface IItemActions {
   all: IItemAction[];
   showed: IItemAction[];
}
