import { ISwipeActionTemplateConfig } from './ISwipeActionTemplateConfig';
import { IItemAction, TActionCaptionPosition } from './IItemAction';

export interface IMeasurer {
   getSwipeConfig(
      actions: IItemAction[],
      rowWidth: number,
      rowHeight: number,
      actionCaptionPosition: TActionCaptionPosition,
      menuButtonVisibility: 'visible'|'adaptive',
      theme: string
   ): ISwipeActionTemplateConfig;
   needIcon(action: IItemAction, actionCaptionPosition: TActionCaptionPosition, hasActionWithIcon?: boolean): boolean;
   needTitle(action: IItemAction, actionCaptionPosition: TActionCaptionPosition): boolean;
}
