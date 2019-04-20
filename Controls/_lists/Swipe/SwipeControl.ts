import Control = require('Core/Control');
import * as template from 'wml!Controls/_lists/Swipe/SwipeControl';
import TouchContextField = require('Controls/Context/TouchContextField');
import aUtil = require('Controls/_lists/ItemActions/Utils/Actions');
import 'css!theme?Controls/_lists/Swipe/Swipe';
import { IMeasurer } from './interface/IMeasurer';
import { IItemAction } from './interface/IItemAction';
import { ISwipeConfig } from './interface/ISwipeConfig';
import {
   ISwipeContext,
   ISwipeControlOptions,
   ISwipeEvent
} from './interface/ISwipeControl';
import { PickOptionalProperties} from 'Controls/Utils/Types';
// @ts-ignore
import { descriptor } from 'Types/entity';
import { IItemData, IListModel } from 'Controls/_lists/interface/IListViewModel';

const MEASURER_NAMES: Record<ISwipeControlOptions['actionAlignment'], string> = {
   horizontal: 'Controls/_lists/Swipe/HorizontalMeasurer',
   vertical: 'Controls/_lists/Swipe/VerticalMeasurer'
};

export default class SwipeControl extends Control {
   protected _options: ISwipeControlOptions;
   private _template: Function = template;
   private _measurer: IMeasurer;
   private _swipeConfig: ISwipeConfig;
   private _animationState: 'close' | 'open' = 'close';

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
            this._options.actionCaptionPosition
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

   _beforeMount(newOptions: ISwipeControlOptions): Promise<void> {
      this._updateModel(newOptions);
      return import(MEASURER_NAMES[newOptions.actionAlignment]).then(
         (result) => {
            this._measurer = result.default;
         }
      );
   }

   _beforeUpdate(
      newOptions: ISwipeControlOptions,
      context: ISwipeContext
   ): void {
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

      if (this._options.actionAlignment !== newOptions.actionAlignment) {
         import(MEASURER_NAMES[newOptions.actionAlignment]).then((result) => {
            this._measurer = result.default;
            this._forceUpdate();
         });
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
         actionAlignment: descriptor(String).oneOf(['horizontal', 'vertical']),
         actionCaptionPosition: descriptor(String).oneOf(['right', 'bottom', 'none'])
      };
   }

   static contextTypes(): ISwipeContext {
      return {
         isTouch: TouchContextField
      };
   }

   static getDefaultOptions(): PickOptionalProperties<ISwipeControlOptions> {
      return {
         itemActionsPosition: 'inside',
         actionAlignment: 'horizontal',
         actionCaptionPosition: 'none'
      };
   }
}
