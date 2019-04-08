import { IMeasurer } from './interface/IMeasurer';
import { IItemAction, ShowType } from './interface/IItemAction';
import { ISwipeConfig, ItemActionsSize } from './interface/ISwipeConfig';
import { TitlePosition } from './interface/ISwipeControl';

const MAX_ACTIONS_COUNT = 3;
const HEIGHT_LOWER_BOUND_WITH_TITLE = 58;
const HEIGHT_LOWER_BOUND_WITHOUT_TITLE = 38;

function getItemActionsSize(
   rowHeight: number,
   titlePosition: TitlePosition
): ItemActionsSize {
   if (titlePosition !== 'none') {
      return rowHeight < HEIGHT_LOWER_BOUND_WITH_TITLE ? 'm' : 'l';
   } else {
      return rowHeight < HEIGHT_LOWER_BOUND_WITHOUT_TITLE ? 'm' : 'l';
   }
}

const HorizontalMeasurer: IMeasurer = {
   getSwipeConfig(
      actions: IItemAction[],
      rowHeight: number,
      titlePosition: Exclude<TitlePosition, 'right'>
   ): ISwipeConfig {
      let itemActions = actions;

      if (actions.length > MAX_ACTIONS_COUNT) {
         itemActions = actions.slice(0, MAX_ACTIONS_COUNT);
         itemActions.push({
            icon: 'icon-SwipeMenu',
            title: rk('Ещё'),
            _isMenu: true,
            showType: ShowType.TOOLBAR
         });
      }

      return {
         itemActionsSize: getItemActionsSize(rowHeight, titlePosition),
         itemActions: {
            all: actions,
            showed: itemActions
         },
         paddingSize: 'm'
      };
   },
   needIcon(
      action: IItemAction,
      titlePosition: Exclude<TitlePosition, 'right'>,
      hasActionWithIcon: boolean = false
   ): boolean {
      return !!action.icon || (hasActionWithIcon && titlePosition !== 'none');
   },
   needTitle(action: IItemAction, titlePosition: TitlePosition): boolean {
      return !action.icon || (titlePosition !== 'none' && !!action.title);
   }
};

export default HorizontalMeasurer;
