import rk = require('i18n!Controls');
import { ISwipeConfig } from 'Controls/display';

import { IMeasurer } from '../interface/IMeasurer';
import { IItemAction, TItemActionShowType, TItemActionsSize, TActionCaptionPosition } from '../interface/IItemActions';
import { MeasurerUtils } from './MeasurerUtils';
import { ISwipeActionTemplateConfig } from '../interface/ISwipeActionTemplateConfig';
import {SwipeActionTemplate} from '../Templates';

const MAX_ACTIONS_COUNT = 3;
const HEIGHT_LOWER_BOUND_WITH_TITLE = 58;
const HEIGHT_LOWER_BOUND_WITHOUT_TITLE = 38;

type ActionCaptionPosition = Exclude<TActionCaptionPosition, 'right'>;

function getItemActionsSize(
   rowHeight: number,
   actionCaptionPosition: ActionCaptionPosition
): TItemActionsSize {
   if (actionCaptionPosition !== 'none') {
      return rowHeight < HEIGHT_LOWER_BOUND_WITH_TITLE ? 'm' : 'l';
   } else {
      return rowHeight < HEIGHT_LOWER_BOUND_WITHOUT_TITLE ? 'm' : 'l';
   }
}

/**
 * Вычисляет горизонтальный размер одной опции свайпа.
 * @param itemAction видимая по свайпу опция записи
 * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
 */
function calculateActionSize(itemAction: IItemAction, templateConfig: ISwipeActionTemplateConfig): number {
   return calculateActionsSizes([itemAction], templateConfig)[0];
}

/**
 * Вычисляет горизонтальные размеры опций свайпа.
 * @param itemActions видимые по свайпу опции записи
 * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
 */
function calculateActionsSizes(itemActions: IItemAction[], templateConfig: ISwipeActionTemplateConfig): number[] {
   const itemsHtml = itemActions.map((action) => SwipeActionTemplate({
      ...templateConfig,
      action
   }));
   return MeasurerUtils.calculateSizesOfItems(
       itemsHtml,
       'controls-UtilsItemAction__measurer',
       'controls-itemActionsV__action');
}

/**
 * Вычисляет на основе горизонтальных размеров видимые опции свайпа
 * @param actions все опции свайпа
 * @param moreButton опция "Ещё"
 * @param rowWidth ширина контейнера для отображения опций свайпа
 * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
 */
function calculateVisibleActions(
    actions: IItemAction[],
    moreButton: IItemAction,
    rowWidth: number,
    templateConfig: ISwipeActionTemplateConfig) {
   const moreButtonSize = calculateActionSize(moreButton, templateConfig);
   let maxWidth = rowWidth - moreButtonSize;

   // По стандарту, показываем не более трёх опций в свайпе.
   // Это позволит не производить слишком много вычислений с DOM
   const itemActions = actions.slice(0, MAX_ACTIONS_COUNT);
   const itemActionsSizes = calculateActionsSizes(itemActions, templateConfig);
   let visibleActions = [];
   itemActions.every((action, index) => {
      maxWidth -= itemActionsSizes[index];
      if (maxWidth < 0) {
         return false;
      }
      visibleActions.push(action);
      return true;
   });
   return visibleActions;
}

export const horizontalMeasurer: IMeasurer = {
   getSwipeConfig(
      actions: IItemAction[],
      rowWidth: number,
      rowHeight: number,
      actionCaptionPosition: ActionCaptionPosition,
      menuButtonVisibility?: 'visible'|'adaptive'
   ): ISwipeConfig {
      let visibleActions = [];
      let isMenuButtonVisible = menuButtonVisibility === 'visible';
      const actionTemplateConfig: ISwipeActionTemplateConfig = {
         itemActionsSize: getItemActionsSize(rowHeight, actionCaptionPosition),
         paddingSize: 'm',
         needIcon: this.needIcon,
         needTitle: this.needTitle,
         actionCaptionPosition,
         theme: 'default', // todo,
         hasActionWithIcon: false // todo
      };
      const moreButton: IItemAction = {
         id: null,
         icon: 'icon-SwipeMenu',
         title: rk('Ещё'),
         _isMenu: true,
         showType: TItemActionShowType.TOOLBAR
      };

      if (actions.length > MAX_ACTIONS_COUNT) {
         visibleActions = calculateVisibleActions(
             MeasurerUtils.getActualActions(actions),
             moreButton,
             rowWidth,
             actionTemplateConfig);
         isMenuButtonVisible = true;
      } else {
         visibleActions = actions;
      }

      if (isMenuButtonVisible) {
         visibleActions.push(moreButton);
      }

      return {
         itemActionsSize: actionTemplateConfig.itemActionsSize,
         itemActions: {
            all: actions,
            showed: visibleActions
         },
         paddingSize: actionTemplateConfig.paddingSize,
         needIcon: actionTemplateConfig.needIcon,
         needTitle: actionTemplateConfig.needTitle
      };
   },
   needIcon(
      action: IItemAction,
      actionCaptionPosition: ActionCaptionPosition,
      hasActionWithIcon: boolean = false
   ): boolean {
      return !!action.icon || (hasActionWithIcon && actionCaptionPosition !== 'none');
   },
   needTitle(action: IItemAction, actionCaptionPosition: ActionCaptionPosition): boolean {
      return !action.icon || (actionCaptionPosition !== 'none' && !!action.title);
   }
};
