import Control = require('Core/Control');
import * as template from 'wml!Controls/_list/Swipe/SwipeControl';
import TouchContextField = require('Controls/Context/TouchContextField');
import aUtil = require('Controls/_list/ItemActions/Utils/Actions');
import 'css!theme?Controls/list';
import { IMeasurer } from './interface/IMeasurer';
import { IItemAction } from './interface/IItemAction';
import { ISwipeConfig } from './interface/ISwipeConfig';
import {
   ISwipeContext,
   ISwipeControlOptions,
   ISwipeEvent,
   IDeprecatedOptions
} from './interface/ISwipeControl';
import { PickOptionalProperties, Omit } from 'Controls/Utils/Types';
import { IoC } from 'Env/Env';
// @ts-ignore
import { descriptor } from 'Types/entity';
import { IItemData, IListModel } from 'Controls/_list/interface/IListViewModel';
import HorizontalMeasurer from 'Controls/_list/Swipe/HorizontalMeasurer';
import VerticalMeasurer from 'Controls/_list/Swipe/VerticalMeasurer';

const MEASURER_NAMES: Record<ISwipeControlOptions['actionAlignment'], IMeasurer> = {
   horizontal: HorizontalMeasurer,
   vertical: VerticalMeasurer
};

export default class SwipeControl extends Control {
   protected _options: ISwipeControlOptions;
   private _template: Function = template;
   private _measurer: IMeasurer;
   private _swipeConfig: ISwipeConfig;
   private _animationState: 'close' | 'open' = 'close';
   private _actionAlignment: ISwipeControlOptions['actionAlignment'];
   private _actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition'];

   constructor(options: ISwipeControlOptions) {
      super();
      this._needTitle = this._needTitle.bind(this);
      this._needIcon = this._needIcon.bind(this);
   }

   private _listSwipe(
      event: Event,
      itemData: IItemData,
      childEvent: ISwipeEvent
   ): void {
      if (childEvent.nativeEvent.direction === 'left' && itemData.itemActions) {
         this._initSwipe(this._options.listModel, itemData, childEvent);
      } else {
         this.closeSwipe(true);
      }
   }

   private _onAnimationEnd(): void {
      if (this._animationState === 'close') {
         this._notifyAndResetSwipe();
      }
   }

   private _needIcon(
      action: IItemAction,
      actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition'],
      hasShowedItemActionWithIcon: boolean
   ): boolean {
      return this._measurer.needIcon(action, actionCaptionPosition, hasShowedItemActionWithIcon);
   }

   private _needTitle(
      action: IItemAction,
      actionCaptionPosition: ISwipeControlOptions['actionCaptionPosition']
   ): boolean {
      return this._measurer.needTitle(action, actionCaptionPosition);
   }

   private _notifyAndResetSwipe(): void {
      this._swipeConfig = null;
      this._notify('closeSwipe', [this._options.listModel.getSwipeItem()]);
      this._options.listModel.setSwipeItem(null);
      this._options.listModel.setActiveItem(null);
   }

   private _updateModel(newOptions: ISwipeControlOptions): void {
      this.closeSwipe();
      newOptions.listModel.subscribe('onListChange', () => {
         this.closeSwipe();
      });
   }

   private _getActionsHeight(target: HTMLElement): number {
      const listItem = target.closest('.controls-ListView__itemV');

      /**
       * Sometimes an item is larger that the area available for actions (e.g. a tile with a title) and the user can accidentally swipe outside of the actions container.
       * So we can't use closest to find a container.
       */
      if (
         listItem.classList.contains(
            'js-controls-SwipeControl__actionsContainer'
         )
      ) {
         return listItem.clientHeight;
      } else {
         return listItem.querySelector(
            '.js-controls-SwipeControl__actionsContainer'
         ).clientHeight;
      }
   }

   private _initSwipe(
      listModel: IListModel,
      itemData: IItemData,
      childEvent: ISwipeEvent
   ): void {
      const actionsHeight = this._getActionsHeight(childEvent.target);
      listModel.setSwipeItem(itemData);
      listModel.setActiveItem(itemData);
      if (this._options.itemActionsPosition !== 'outside') {
         this._swipeConfig = this._measurer.getSwipeConfig(
            itemData.itemActions.all,
            actionsHeight,
            this._actionCaptionPosition
         );
         listModel.setItemActions(itemData.item, this._swipeConfig.itemActions);
      }
      this._animationState = 'open';
   }

   private _onItemActionsClick(
      event: Event,
      action: IItemAction,
      itemData: IItemData
   ): void {
      aUtil.itemActionsClick(this, event, action, itemData, this._options.listModel, true);
   }

   private _listClick(): void {
      this.closeSwipe();
   }

   private _listDeactivated(): void {
      this.closeSwipe();
   }

   private _checkDeprecated(oldOptions: IDeprecatedOptions, newOptions: IDeprecatedOptions): void {
      const logger = IoC.resolve('ILogger');
      if (oldOptions.swipeDirection !== newOptions.swipeDirection) {
         logger.warn('Option "swipeDirection" is deprecated and will be removed in 19.400. Use option "actionAlignment".');
         this._actionAlignment = newOptions.swipeDirection === 'row' ? 'horizontal' : 'vertical';
      }
      if (oldOptions.titlePosition !== newOptions.titlePosition) {
         logger.warn('Option "titlePosition" is deprecated and will be removed in 19.400. Use option "actionCaptionPosition".');
         this._actionCaptionPosition = newOptions.titlePosition;
      }
   }

   _beforeMount(newOptions: ISwipeControlOptions): void {
      this._actionAlignment = newOptions.actionAlignment;
      this._actionCaptionPosition = newOptions.actionCaptionPosition;
      this._checkDeprecated({}, newOptions);
      this._updateModel(newOptions);
      this._measurer = MEASURER_NAMES[this._actionAlignment];
   }

   _beforeUpdate(
      newOptions: ISwipeControlOptions,
      context: ISwipeContext
   ): void {
      if (this._options.actionAlignment !== newOptions.actionAlignment) {
         this._actionAlignment = newOptions.actionAlignment;
      }
      if (this._options.actionCaptionPosition !== newOptions.actionCaptionPosition) {
         this._actionCaptionPosition = newOptions.actionCaptionPosition;
      }
      this._checkDeprecated(this._options, newOptions);
      if (
         this._swipeConfig &&
         context &&
         context.isTouch &&
         !context.isTouch.isTouch
      ) {
         this.closeSwipe();
      }
      if (
         newOptions.itemActions &&
         this._options.itemActions !== newOptions.itemActions
      ) {
         this.closeSwipe();
      }
      if (
         newOptions.listModel &&
         this._options.listModel !== newOptions.listModel
      ) {
         this._updateModel(newOptions);
      }

      if (this._options.actionAlignment !== newOptions.actionAlignment || this._options.swipeDirection !== newOptions.swipeDirection) {
         this._measurer = MEASURER_NAMES[this._actionAlignment];
      }
   }

   _beforeUnmount(): void {
      this._swipeConfig = null;
      this._measurer = null;
   }

   closeSwipe(withAnimation: boolean = false): void {
      if (this._animationState === 'open') {
         this._animationState = 'close';
         if (withAnimation) {
            this._options.listModel.nextModelVersion();
         } else {
            this._notifyAndResetSwipe();
         }
      }
   }

   static getOptionTypes(): Record<keyof ISwipeControlOptions, object> {
      return {
         listModel: descriptor(Object).required(),
         /**
          * TODO: itemActions should be required, but it would break lists without them because SwipeControl always gets created.
          * Make SwipeControl async after this: https://online.sbis.ru/opendoc.html?guid=515423be-194b-4655-aba9-bba005c2e5c6
          */
         itemActions: descriptor(Array),
         itemActionsPosition: descriptor(String).oneOf(['inside', 'outside']),
         swipeDirection: descriptor(String).oneOf(['row', 'column']),
         titlePosition: descriptor(String).oneOf(['right', 'bottom', 'none']),
         actionAlignment: descriptor(String).oneOf(['horizontal', 'vertical']),
         actionCaptionPosition: descriptor(String).oneOf(['right', 'bottom', 'none'])
      };
   }

   static contextTypes(): ISwipeContext {
      return {
         isTouch: TouchContextField
      };
   }

   static getDefaultOptions(): Omit<PickOptionalProperties<ISwipeControlOptions>, keyof IDeprecatedOptions> {
      return {
         itemActionsPosition: 'inside',
         actionAlignment: 'horizontal',
         actionCaptionPosition: 'none'
      };
   }
}
