define('Controls/List/Swipe/SwipeControl', [
   'Core/Control',
   'wml!Controls/List/Swipe/SwipeControl',
   'Controls/Application/TouchDetector/TouchContextField',
   'Controls/List/ItemActions/Utils/Actions',
   'Core/Deferred',
   'Controls/Utils/Toolbar',
   'css!Controls/List/Swipe/Swipe'
], function(
   Control,
   template,
   TouchContextField,
   aUtil,
   Deferred
) {
   'use strict';

   var _private = {
      notifyAndResetSwipe: function(self) {
         self._swipeConfig = null;
         self._notify('closeSwipe', [self._options.listModel.getSwipeItem()]);
         self._options.listModel.setSwipeItem(null);
         self._options.listModel.setActiveItem(null);
      },

      closeSwipe: function(self, withAnimation) {
         if (self._animationState === 'open') {
            self._animationState = 'close';
            if (withAnimation) {
               self._options.listModel._nextVersion();
            } else {
               _private.notifyAndResetSwipe(self);
            }
         }
      },

      updateModel: function(self, newOptions) {
         self.closeSwipe(self);
         newOptions.listModel.subscribe('onListChange', function() {
            self.closeSwipe(self);
         });
      },

      initSwipe: function(self, listModel, itemData, childEvent) {
         var actionsHeight = childEvent.target.closest('.js-controls-SwipeControl__actionsContainer').clientHeight;
         listModel.setSwipeItem(itemData);
         listModel.setActiveItem(itemData);
         if (self._options.itemActionsPosition !== 'outside') {
            self._swipeConfig = self._measurer.getSwipeConfig(itemData.itemActions, actionsHeight);
            listModel.setItemActions(itemData.item, self._measurer.initItemsForSwipe(itemData.itemActions, actionsHeight, self._swipeConfig.type));
         }
         self._animationState = 'open';
      },

      getMeasurerModuleName: function(viewName) {
         return viewName.indexOf('TileView') !== -1 ? 'Controls/List/Swipe/Tile' : 'Controls/List/Swipe/List';
      }
   };

   var SwipeControl = Control.extend({
      _template: template,
      _swipeConfig: null,

      constructor: function() {
         SwipeControl.superclass.constructor.apply(this, arguments);
         this._needShowSeparator = this._needShowSeparator.bind(this);
         this._needShowTitle = this._needShowTitle.bind(this);
         this._needShowIcon = this._needShowIcon.bind(this);
      },

      _beforeMount: function(newOptions) {
         var
            def = new Deferred(),
            self = this;
         if (newOptions.listModel) {
            _private.updateModel(this, newOptions);
         }
         require([_private.getMeasurerModuleName(newOptions.viewName)], function(result) {
            self._measurer = result;
            def.callback();
         });
         return def;
      },

      _beforeUpdate: function(newOptions, context) {
         var self = this;
         if (this._swipeConfig && !context.isTouch.isTouch) {
            _private.closeSwipe(this);
         }
         if (
            newOptions.itemActions &&
            this._options.itemActions !== newOptions.itemActions
         ) {
            _private.closeSwipe(this);
         }
         if (
            newOptions.listModel &&
            this._options.listModel !== newOptions.listModel
         ) {
            _private.updateModel(this, newOptions);
         }

         if (this._options.viewName !== newOptions.viewName) {
            require([_private.getMeasurerModuleName(newOptions.viewName)], function(result) {
               self._measurer = result;
               self._forceUpdate();
            });
         }
      },

      _listSwipe: function(event, itemData, childEvent) {
         if (
            childEvent.nativeEvent.direction === 'left' &&
            itemData.itemActions
         ) {
            _private.initSwipe(this, this._options.listModel, itemData, childEvent);
         } else {
            _private.closeSwipe(this, true);
         }
      },


      _listDeactivated: function() {
         _private.closeSwipe(this);
      },

      _listClick: function() {
         _private.closeSwipe(this);
      },

      _needShowSeparator: function(action, itemActions, type) {
         return this._measurer.needShowSeparator(action, itemActions, type);
      },

      _needShowIcon: function(action, direction, hasShowedItemActionWithIcon) {
         return this._measurer.needShowIcon(action, direction, hasShowedItemActionWithIcon);
      },

      _needShowTitle: function(action, type, hasIcon) {
         return this._measurer.needShowTitle(action, type, hasIcon);
      },

      _onItemActionsClick: function(event, action, itemData) {
         aUtil.itemActionsClick(this, event, action, itemData, true);
      },

      closeSwipe: function() {
         _private.closeSwipe(this);
      },

      _onAnimationEnd: function() {
         if (this._animationState === 'close') {
            _private.notifyAndResetSwipe(this);
         }
      }
   });

   SwipeControl.contextTypes = function contextTypes() {
      return {
         isTouch: TouchContextField
      };
   };

   return SwipeControl;
});
