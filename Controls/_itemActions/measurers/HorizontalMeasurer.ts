import rk = require('i18n!Controls');
import { ISwipeConfig } from 'Controls/display';

import { IMeasurer } from '../interface/IMeasurer';
import { IItemAction, TItemActionShowType, TItemActionsSize, TActionCaptionPosition } from '../interface/IItemActions';
import { MeasurerUtils } from './MeasurerUtils';
import { ISwipeActionTemplateConfig } from '../interface/ISwipeActionTemplateConfig';
import { SwipeActionTemplate } from '../Templates';

const MAX_ACTIONS_COUNT = 3;
const HEIGHT_LOWER_BOUND_WITH_TITLE = 58;
const HEIGHT_LOWER_BOUND_WITHOUT_TITLE = 38;

type ActionCaptionPosition = Exclude<TActionCaptionPosition, 'right'>;

class HorizontalMeasurer implements IMeasurer {
   private constructor() { }

   getSwipeConfig(
      actions: IItemAction[],
      rowWidth: number,
      rowHeight: number,
      actionCaptionPosition: ActionCaptionPosition,
      menuButtonVisibility?: 'visible'|'adaptive'
   ): ISwipeConfig {
      const actualActions: IItemAction[] = MeasurerUtils.getActualActions(actions);
      let visibleActions: IItemAction[] = [];
      const actionTemplateConfig = this._getActionTemplateConfig(rowHeight, actionCaptionPosition);
      const moreButton = HorizontalMeasurer._getMoreButton();

      if (actualActions.length) {
         visibleActions =
             HorizontalMeasurer._calculateVisibleActions(actualActions, moreButton, rowWidth, actionTemplateConfig);
      }

      if (menuButtonVisibility === 'visible' || visibleActions.length < actualActions.length) {
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
   }

   needIcon(
      action: IItemAction,
      actionCaptionPosition: ActionCaptionPosition,
      hasActionWithIcon: boolean = false
   ): boolean {
      return !!action.icon || (hasActionWithIcon && actionCaptionPosition !== 'none');
   }

   needTitle(action: IItemAction, actionCaptionPosition: ActionCaptionPosition): boolean {
      return !action.icon || (actionCaptionPosition !== 'none' && !!action.title);
   }

   /**
    * Возвращает конфиг для шаблона swipeAction, необходимый для измерения ширины опций записи
    * @param rowHeight
    * @param actionCaptionPosition
    * @private
    */
   private _getActionTemplateConfig(
       rowHeight: number,
       actionCaptionPosition: ActionCaptionPosition
   ): ISwipeActionTemplateConfig {
      return {
         itemActionsSize: HorizontalMeasurer._getItemActionsSize(rowHeight, actionCaptionPosition),
         paddingSize: 'm',
         needIcon: this.needIcon,
         needTitle: this.needTitle,
         actionCaptionPosition,
         actionAlignment: 'horizontal',
         theme: 'default', // todo,
         hasActionWithIcon: false // todo
      };
   }

   private static instance: HorizontalMeasurer;

   static getInstance(): HorizontalMeasurer {
      if (!HorizontalMeasurer.instance) {
         HorizontalMeasurer.instance = new HorizontalMeasurer();
      }

      return HorizontalMeasurer.instance;
   }

   /**
    * Возвращает кнопку Ещё
    * @private
    */
   private static _getMoreButton(): IItemAction {
      return {
         id: null,
         icon: 'icon-SwipeMenu',
         title: rk('Ещё'),
         _isMenu: true,
         showType: TItemActionShowType.TOOLBAR
      };
   }

   /**
    * Вычисляет горизонтальный размер одной опции свайпа.
    * @param itemAction видимая по свайпу опция записи
    * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
    */
   private static _calculateActionSize(itemAction: IItemAction, templateConfig: ISwipeActionTemplateConfig): number {
      return this._calculateActionsSizes([itemAction], templateConfig)[0];
   }

   /**
    * Вычисляет горизонтальные размеры опций свайпа.
    * @param itemActions видимые по свайпу опции записи
    * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
    */
   private static _calculateActionsSizes(itemActions: IItemAction[], templateConfig: ISwipeActionTemplateConfig): number[] {
      const itemsHtml = itemActions.map((action) => SwipeActionTemplate({
         ...templateConfig,
         action
      }));
      return MeasurerUtils.calculateSizesOfItems(
          itemsHtml,
          'controls-UtilsItemAction__measurer',
          'controls-Swipe__action');
   }

   /**
    * Вычисляет на основе горизонтальных размеров видимые опции свайпа
    * @param actions все опции свайпа
    * @param moreButton опция "Ещё"
    * @param rowWidth ширина контейнера для отображения опций свайпа
    * @param templateConfig настройки шаблона для виртуальной отрисовки ItemAction
    */
   private static _calculateVisibleActions(
       actions: IItemAction[],
       moreButton: IItemAction,
       rowWidth: number,
       templateConfig: ISwipeActionTemplateConfig): IItemAction[] {
      const moreButtonSize = this._calculateActionSize(moreButton, templateConfig);
      let maxWidth = rowWidth - moreButtonSize;

      // По стандарту, показываем не более трёх опций в свайпе.
      // Кроме всего прочего, это позволит не производить слишком много вычислений с DOM
      const itemActions = actions.slice(0, MAX_ACTIONS_COUNT);
      const itemActionsSizes = this._calculateActionsSizes(itemActions, templateConfig);
      const visibleActions: IItemAction[] = [];
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

   private static _getItemActionsSize(
       rowHeight: number,
       actionCaptionPosition: ActionCaptionPosition
   ): TItemActionsSize {
      if (actionCaptionPosition !== 'none') {
         return rowHeight < HEIGHT_LOWER_BOUND_WITH_TITLE ? 'm' : 'l';
      } else {
         return rowHeight < HEIGHT_LOWER_BOUND_WITHOUT_TITLE ? 'm' : 'l';
      }
   }
}

export const horizontalMeasurer = HorizontalMeasurer.getInstance();
