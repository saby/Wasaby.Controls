import { IMeasurer } from './interface/IMeasurer';
import { IItemAction, ShowType } from './interface/IItemAction';
import { ISwipeConfig, ItemActionsSize } from './interface/ISwipeConfig';
import { TitlePosition } from './interface/ISwipeControl';

const breakpoints: Record<
   TitlePosition,
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
   titlePosition: TitlePosition
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

   if (x < breakpoints[titlePosition].lowerBound) {
      return getItemActionsSize(countOfActions - 1, rowHeight, titlePosition);
   }
   if (
      x >= breakpoints[titlePosition].lowerBound &&
      x < breakpoints[titlePosition].upperBound
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

const VerticalMeasurer: IMeasurer = {
   getSwipeConfig(
      actions: IItemAction[],
      rowHeight: number,
      titlePosition: TitlePosition
   ): ISwipeConfig {
      let itemActions = actions;
      const {
         itemActionsSize,
         countOfActions
      }: {
         itemActionsSize: ItemActionsSize;
         countOfActions: number;
      } = getItemActionsSize(actions.length, rowHeight, titlePosition);

      if (countOfActions !== actions.length) {
         itemActions = actions.slice(0, countOfActions - 1);
         itemActions.push({
            icon: 'icon-ExpandDown',
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
         paddingSize: titlePosition === 'none' ? 'm' : 'l'
      };
   },
   needIcon(action: IItemAction): boolean {
      return !!action.icon;
   },
   needTitle(action: IItemAction, titlePosition: TitlePosition): boolean {
      return titlePosition !== 'none' && !!action.title;
   }
};

export default VerticalMeasurer;
