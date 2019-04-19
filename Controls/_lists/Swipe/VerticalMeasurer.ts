import { IMeasurer } from './interface/IMeasurer';
import { IItemAction, ShowType } from './interface/IItemAction';
import { ISwipeConfig, ItemActionsSize } from './interface/ISwipeConfig';
import { ISwipeControlOptions } from './interface/ISwipeControl';

const breakpoints: Record<
   ISwipeControlOptions['actionCaptionPosition'],
   {
      lowerBound: number;
      upperBound: number;
   }
> = {
   bottom: {
      lowerBound: 42,
      upperBound: 52
   },
   right: {
      lowerBound: 24,
      upperBound: 32
   },
   none: {
      lowerBound: 24,
      upperBound: 32
   }
};

const MIN_SPACING = 12;

function getItemActionsSize(
   countOfActions: number,
   rowHeight: number,
   actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition']
): {
   itemActionsSize: ItemActionsSize;
   countOfActions: number;
} {
   if (countOfActions === 1) {
      return {
         countOfActions,
         itemActionsSize: 'm'
      };
   }

   const x =
      (rowHeight - MIN_SPACING - (MIN_SPACING + 1) * (countOfActions - 1)) / countOfActions;

   if (x < breakpoints[actionCaptionPosition].lowerBound) {
      return getItemActionsSize(countOfActions - 1, rowHeight, actionCaptionPosition);
   }
   if (
      x >= breakpoints[actionCaptionPosition].lowerBound &&
      x < breakpoints[actionCaptionPosition].upperBound
   ) {
      return {
         countOfActions,
         itemActionsSize: 'm'
      };
   }
   return {
      countOfActions,
      itemActionsSize: 'l'
   };
}

function getPaddingSize(
   actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition'],
   itemActionsSize: ItemActionsSize
): 's' | 'm' | 'l' {
   switch (actionCaptionPosition) {
      case 'none':
         return 'm';
      case 'right':
         return 'l';
      case 'bottom':
         return itemActionsSize === 'l' ? 'l' : 's';
   }
}

const VerticalMeasurer: IMeasurer = {
   getSwipeConfig(
      actions: IItemAction[],
      rowHeight: number,
      actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition']
   ): ISwipeConfig {
      let itemActions = actions;
      const {
         itemActionsSize,
         countOfActions
      }: {
         itemActionsSize: ItemActionsSize;
         countOfActions: number;
      } = getItemActionsSize(actions.length, rowHeight, actionCaptionPosition);

      if (countOfActions !== actions.length) {
         itemActions = actions.slice(0, countOfActions - 1);
         itemActions.push({
            icon: 'icon-SwipeMenu',
            title: rk('Ещё'),
            _isMenu: true,
            showType: ShowType.MENU
         });
      }

      return {
         itemActionsSize,
         itemActions: {
            all: actions,
            showed: itemActions
         },
         paddingSize: getPaddingSize(actionCaptionPosition, itemActionsSize)
      };
   },
   needIcon(
      action: IItemAction,
      actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition'],
      hasActionWithIcon: boolean = false
   ): boolean {
      return !!action.icon || (hasActionWithIcon && actionCaptionPosition === 'right');
   },
   needTitle(action: IItemAction, actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition']): boolean {
      return !action.icon || actionCaptionPosition !== 'none' && !!action.title;
   }
};

export default VerticalMeasurer;
