define('Controls/List/ItemActions/ItemActionsControl', [
   'Core/Control',
   'tmpl!Controls/List/ItemActions/ItemActionsControl',
   'WS.Data/Collection/RecordSet',
   'css!Controls/List/ItemActions/ItemActions'
], function(
   Control,
   template,
   RecordSet
) {
   'use strict';

   var _private = {

      bindHandlers: function(self) {
         self._closeActionsMenu = self._closeActionsMenu.bind(self);
      },

      fillItemActions: function(item, itemActions, itemActionVisibilityCallback) {
         var actions = [];
         itemActions.forEach(function(action) {
            if (!itemActionVisibilityCallback || itemActionVisibilityCallback(action, item)) {
               if (action.icon && !~action.icon.indexOf('controls-itemActionsV__action_icon')) {
                  action.icon += ' controls-itemActionsV__action_icon icon-size';
                  if (~action.icon.indexOf('icon-done')) {
                     action.iconDone = true;
                  }
                  if (~action.icon.indexOf('icon-error')) {
                     action.iconError = true;
                  }
               }
               actions.push(action);
            }
         });
         return actions;
      },

      updateActions: function(options) {
         if (options.itemActions) {
            for (options.listModel.reset();  options.listModel.isEnd();  options.listModel.goToNext()) {
               var itemData = options.listModel.getCurrent();
               options.listModel.setItemActions(itemData, _private.fillItemActions(itemData.item, options.itemActions, options.itemActionVisibilityCallback));
            }
         }
      },
      needActionsMenu: function(actions) {
         var
            main = 0,
            additional = 0;
         actions.forEach(function(action) {
            if (action.main) {
               main++;
            }
            if (action.additional) {
               additional++;
            }
         });
         return (additional + main !==  actions.length);
      },
      showActionsMenu: function(self, event, itemData, childEvent) {
         var
            context = event.type === 'itemcontextmenu',
            showActions = context && itemData.itemActions
               ? itemData.itemActions
               : itemData.itemActions && itemData.itemActions.filter(function(action) {
                  return !action.additional;
               });
         if (showActions && !itemData.isEditing) {
            var
               rs = new RecordSet({rawData: showActions}),
               realEvent =  childEvent ? childEvent : event;
            realEvent.nativeEvent.preventDefault();
            itemData.contextEvent = context;
            self._options.listModel._activeItem = itemData;
            self._options.listModel._nextVersion();
            self._children['itemActionsOpener'].open({
               target: !context ? event.target : false,
               componentOptions: {items: rs}
            });
         }
      },
      closeActionsMenu: function(self, args) {
         var
            actionName = args && args.action,
            event = args && args.event;

         //todo: Особая логика событий попапа, исправить как будут нормально приходить аргументы
         if (actionName === 'itemClick') {
            var action = args.data && args.data[0] && args.data[0].getRawData();
            self._onActionClick(event, action, self._options.listModel._activeItem.item);
         }
         self._children['itemActionsOpener'].close();
         self._options.listModel._activeItem = false;
         self._options.listModel._nextVersion();
         self._forceUpdate();
      },
      updateModel: function(options, newOptions) {
         _private.updateActions(newOptions);
         newOptions.listModel.subscribe('onListChange', function() {
            _private.updateActions(options);
         });
      }
   };

   var ItemActionsControl = Control.extend({

      _template: template,

      constructor: function(cfg) {
         ItemActionsControl.superclass.constructor.apply(this, arguments);
         _private.bindHandlers(this);
      },

      _beforeMount: function(newOptions) {
         if (newOptions.listModel) {
            _private.updateModel(this._options, newOptions);
         }
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.listModel && (this._options.listModel !== newOptions.listModel)) {
            _private.updateModel(this._options, newOptions);
         }
      },

      _onActionClick: function(event, action, item) {
         event.stopPropagation();
         this._notify('actionClick', [action, item], {bubbling: true});
         action.handler && action.handler(item);
      },

      _needActionsMenu: function(actions) {
         return _private.needActionsMenu(actions);
      },

      _showActionsMenu: function(event, itemData, childEvent) {
         _private.showActionsMenu(this, event, itemData, childEvent);
      },

      _closeActionsMenu: function(args) {
         _private.closeActionsMenu(this, args);
      },

      _applyEdit: function(event, item) {
         event.stopPropagation();
         this._notify('commitActionClick', [item]);
      },

      _cancelEdit: function(event, item) {
         event.stopPropagation();
         this._notify('cancelActionClick', [item]);
      },
      updateActions: function() {
         _private.updateActions(this._options);
      }
   });

   ItemActionsControl.getDefaultOptions = function() {
      return {
         itemActionsType: 'inline',
         itemActionVisibilityCallback: function() {
            return true;
         }
      };
   };

   return ItemActionsControl;
});
