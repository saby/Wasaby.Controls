import { ISwipeConfig } from './ISwipeConfig';
import { IItemAction, TActionCaptionPosition } from './IItemAction';

export interface IMeasurer {
   getSwipeConfig(
      actions: IItemAction[],
      rowWidth: number,
      rowHeight: number,
      actionCaptionPosition: TActionCaptionPosition,
      menuButtonVisibility: 'visible'|'adaptive',
      theme: string
   ): ISwipeConfig;
   needIcon(action: IItemAction, actionCaptionPosition: TActionCaptionPosition, hasActionWithIcon?: boolean): boolean;
   needTitle(action: IItemAction, actionCaptionPosition: TActionCaptionPosition): boolean;
}
