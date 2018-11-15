define('Controls/List/ItemActions/ItemActionsControl', [
   'Core/Control',
   'wml!Controls/List/ItemActions/ItemActionsControl',
   'Controls/Utils/Toolbar',
   'Controls/List/ItemActions/Utils/Actions',
   'Controls/Constants',
   'Controls/Context/TouchContextField',
   'css!Controls/List/ItemActions/ItemActionsControl'
], function(
   Control,
   template,
   tUtil,
   aUtil,
   ControlsConstants,
   TouchContextField
) {
   'use strict';

   var
      ACTION_ICON_CLASS = 'controls-itemActionsV__action_icon  icon-size';

   var _private = {

      sortActions: function(first, second) {
         return (second.showType || 0) - (first.showType || 0);
      },

      fillItemAllActions: function(item, itemActions, itemActionVisibilityCallback) {
         var actions = [];
         itemActions.forEach(function(action) {
            if (!itemActionVisibilityCallback || itemActionVisibilityCallback(action, item)) {
               if (action.icon && !~action.icon.indexOf(ACTION_ICON_CLASS)) {
                  action.icon += ' ' + ACTION_ICON_CLASS;
                  if (action.iconStyle && ~action.iconStyle.indexOf('done')) {
                     action.iconDone = true;
                  }
                  if (action.iconStyle && ~action.iconStyle.indexOf('error')) {
                     action.iconError = true;
                  }
               }
               actions.push(action);
            }
         });
         return actions;
      },

      updateItemActions: function(self, item, options, isEditingItem, isTouch) {
         var
            all = _private.fillItemAllActions(item, options.itemActions, options.itemActionVisibilityCallback),

            showed = options.itemActionsPosition === 'outside'
               ? all
               : all.filter(function(action) {
                  return action.showType === tUtil.showType.TOOLBAR || action.showType === tUtil.showType.MENU_TOOLBAR;
               });

         if (isTouch) {
            showed.sort(_private.sortActions);
         }

         if (isEditingItem && options.showToolbar) {
            showed.push({
               icon: 'icon-Yes icon-done ' + ACTION_ICON_CLASS,
               style: 'bordered',
               iconDone: true,
               handler: function(item) {
                  this._applyEdit(item);
               }.bind(self)
            });
            showed.push({
               icon: 'icon-Close icon-primary ' + ACTION_ICON_CLASS,
               style: 'bordered',
               handler: function(item) {
                  this._cancelEdit(item);
               }.bind(self)
            });
         }

         if (_private.needActionsMenu(all, options.itemActionsPosition)) {
            showed.push({
               title: 'Еще',
               icon: 'icon-ExpandDown icon-primary ' + ACTION_ICON_CLASS,
               isMenu: true
            });
         }

         options.listModel.setItemActions(item, {
            all: all,
            showed: showed
         });
      },

      updateActions: function(self, options, isTouch) {
         if (options.itemActions) {
            for (options.listModel.reset(); options.listModel.isEnd(); options.listModel.goToNext()) {
               var
                  itemData = options.listModel.getCurrent(),
                  item = itemData.item;
               if (item !== ControlsConstants.view.hiddenGroup && item.get) {
                  _private.updateItemActions(self, item, options, itemData.isEditing, isTouch);
               }
            }
         }
      },

      updateModel: function(self, newOptions, isTouch) {
         _private.updateActions(self, newOptions, isTouch);
         newOptions.listModel.subscribe('onListChange', function() {
            _private.updateActions(self, self._options, self._context.isTouch.isTouch);
         });
      },

      needActionsMenu: function(actions, itemActionsPosition) {
         var
            main = 0,
            additional = 0;
         actions && actions.forEach(function(action) {
            if (action.showType === tUtil.showType.MENU_TOOLBAR) {
               main++;
            }
            if (action.showType === tUtil.showType.TOOLBAR) {
               additional++;
            }
         });

         return actions && (additional + main !== actions.length) && itemActionsPosition !== 'outside';
      }
   };

   var ItemActionsControl = Control.extend({

      _template: template,

      _beforeMount: function(newOptions, context) {
         if (newOptions.listModel) {
            _private.updateModel(this, newOptions, context.isTouch.isTouch);
         }
      },

      _beforeUpdate: function(newOptions, context) {
         var args = [this, newOptions, context.isTouch.isTouch];

         if (newOptions.listModel && (this._options.listModel !== newOptions.listModel)) {
            _private.updateModel.apply(null, args);
         }

         if (newOptions.itemActions && (this._options.itemActions !== newOptions.itemActions || this._options.itemActionVisibilityCallback !== newOptions.itemActionVisibilityCallback)) {
            _private.updateActions.apply(null, args);
         }
      },

      _onItemActionsClick: function(event, action, itemData) {
         aUtil.itemActionsClick(this, event, action, itemData);
      },

      _applyEdit: function(item) {
         this._notify('commitActionClick', [item]);
      },

      _cancelEdit: function(item) {
         this._notify('cancelActionClick', [item]);
      },

      updateItemActions: function(item, isEditingItem) {
         _private.updateItemActions(this, item, this._options, isEditingItem, this._context.isTouch.isTouch);
      }
   });

   ItemActionsControl.getDefaultOptions = function() {
      return {
         itemActionsPosition: 'inside',
         itemActions: []
      };
   };

   ItemActionsControl.contextTypes = function contextTypes() {
      return {
         isTouch: TouchContextField
      };
   };

   return ItemActionsControl;
});
