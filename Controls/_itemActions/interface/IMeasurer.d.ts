import { ISwipeConfig } from './ISwipeConfig';
import { IItemAction, TActionCaptionPosition } from './IItemAction';

export interface IMeasurer {
   getSwipeConfig(
      actions: IItemAction[],
      rowWidth: number,
      rowHeight: number,
      actionCaptionPosition: TActionCaptionPosition,
      menuButtonVisibility?: 'visible'|'adaptive'
   ): ISwipeConfig;
   needIcon(action: IItemAction, actionCaptionPosition: TActionCaptionPosition, hasActionWithIcon?: boolean): boolean;
   needTitle(action: IItemAction, actionCaptionPosition: TActionCaptionPosition): boolean;
}
