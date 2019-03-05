import { ISwipeConfig } from './ISwipeConfig';
import { IItemAction } from './IItemAction';
import { TitlePosition } from './ISwipeControl';

export interface IMeasurer {
   getSwipeConfig(
      actions: IItemAction[],
      rowHeight: number,
      titlePosition: TitlePosition
   ): ISwipeConfig;
   needIcon(action: IItemAction, hasActionWithIcon?: boolean): boolean;
   needTitle(action: IItemAction, titlePosition: TitlePosition): boolean;
}
