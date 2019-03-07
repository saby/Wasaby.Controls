import { IItemAction } from './IItemAction';
import {IListModel} from "Controls/_list/interface/IListViewModel";

export type TitlePosition = 'right' | 'bottom' | 'none';
export type SwipeDirection = 'row' | 'column';
export type ItemActionsPosition = 'inside' | 'outside';

export interface ISwipeEvent extends Event {
   target: HTMLElement;
   nativeEvent: {
      direction: 'left' | 'right' | 'top' | 'bottom';
   };
}

export interface ISwipeContext {
   isTouch: {
      isTouch: boolean;
   };
}

export interface ISwipeControlOptions {
   listModel: IListModel;
   itemActions: IItemAction[];
   itemActionsPosition?: ItemActionsPosition;
   swipeDirection?: SwipeDirection;
   titlePosition?: TitlePosition;
}
