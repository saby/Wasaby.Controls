define('Controls/List/ItemActions/ItemActionsControl', [
   'Core/Control',
   'tmpl!Controls/List/ItemActions/ItemActionsControl',
   'WS.Data/Collection/RecordSet',
   'tmpl!Controls/List/ItemActions/ItemActionsMenuFooter',
   'css!Controls/List/ItemActions/ItemActions'
], function (
   Control,
   template,
   RecordSet
) {
   'use strict';

   var _private = {

      bindHandlers: function(self) {
         self._closeActionsMenu = self._closeActionsMenu.bind(self);
      },

      fillItemActions: function(item, itemActions, itemActionVisibilityCallback){
         var actions = [];
        itemActions.forEach(function(action){
            if (itemActionVisibilityCallback(action, item)) {
               actions.push(action);
            }
         });
         return actions;
      },

      updateActions: function(options){
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
            if (action.main) main++;
            if (action.additional) additional++;
         });
         return (additional + main !==  actions.length);
      },
      showActionsMenu: function(self, event, itemData, childEvent) {
         var
            context = event.type === 'itemcontextmenu',
            showActions = context && itemData.itemActions ?
               itemData.itemActions :
               itemData.itemActions && itemData.itemActions.filter(function(action){
                  return !action.additional;
               });
         if (showActions) {
            var
               rs = new RecordSet({rawData: showActions}),
               realEvent =  childEvent ? childEvent: event;
            realEvent.nativeEvent.preventDefault();
            self._options.listModel._actionHoverItem = itemData.item;
            self._children['itemActionsOpener'].open({
               target: !context ? event.target: false,
               componentOptions: {items: rs}
            });
         }
      },
      closeActionsMenu: function(self, args) {
         var
            actionName = args && args[0],
            event = args && args[1];
         //todo: Особая логика событий попапа, исправить как будут нормально приходить аргументы
         if (actionName === 'itemClick') {
            var action = args[2][0].getRawData();
            self._onActionClick(event, action, self._options.listModel._actionHoverItem);
         }
         self._children['itemActionsOpener'].close();
         self._options.listModel._actionHoverItem = false;
         self._forceUpdate();
      },
      updateModel: function(options, newOptions) {
         _private.updateActions(newOptions);
         newOptions.listModel.subscribe('onListChange', function() {
            _private.updateActions(options);
         });
      }
   };

   var ItemActionsControl = Control.extend( {

      _template: template,

      constructor: function (cfg) {
         ItemActionsControl.superclass.constructor.apply(this, arguments);
         _private.bindHandlers(this);
      },

      _beforeMount: function(newOptions){
         if (newOptions.listModel) {
            _private.updateModel(this._options, newOptions)
         }
      },

      _beforeUpdate: function(newOptions){
         if (newOptions.listModel && (this._options.listModel !== newOptions.listModel)) {
            _private.updateModel(this._options, newOptions);
         }
      },

      _onActionClick: function(event, action, item){
         this._notify('actionClick', [action, item], {bubbling: true});
         action.handler && action.handler(item);
      },

      _needActionsMenu: function(actions) {
         return _private.needActionsMenu(actions);
      },

      _showActionsMenu: function(event, itemData, childEvent) {
         _private.showActionsMenu(this, event, itemData, childEvent)
      },

      _closeActionsMenu: function(args) {
         _private.closeActionsMenu(this, args);
      }

   });

   ItemActionsControl.getDefaultOptions = function() {
      return {
         itemActionsType: 'inline',
         itemActionVisibilityCallback: function(){ return true;}
      }
   };

   return ItemActionsControl;
});
