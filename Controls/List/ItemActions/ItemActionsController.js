define('Controls/List/ItemActions/ItemActionsController', [
   'Core/Control',
   'tmpl!Controls/List/ItemActions/ItemActionsController',
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

      fillItemActions: function(self, item){
         var actions = [];
         self._options.itemActions.forEach(function(action){
            if (self._options.showAction(action, item)) {
               actions.push(action);
            }
         });
         return actions;
      },

      updateActions: function(self){
         if (self._options.itemActions) {
            for (self._listModel.reset();  self._listModel.isEnd();  self._listModel.goToNext()) {
               var itemData = self._listModel.getCurrent();
               self._listModel.setItemActions(itemData, _private.fillItemActions(self, itemData.item));
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
            var  rs = new RecordSet({rawData: showActions});
            childEvent ? childEvent.nativeEvent.preventDefault() : event.nativeEvent.preventDefault();
            self._listModel._actionHoverItem = itemData.item;
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
         if (actionName === 'itemClick') {
            var action = args[2][0].getRawData();
            self._onActionClick(event, action, self._listModel._actionHoverItem);
         }
         self._children['itemActionsOpener'].close();
         self._listModel._actionHoverItem = false;
         self._forceUpdate();
      }
   };

   var ItemActionsController = Control.extend( {
      _template: template,
      _listModel: null,
      constructor: function (cfg) {
         ItemActionsController.superclass.constructor.apply(this, arguments);
         this._publish('onDataLoad');
         _private.bindHandlers(this);
      },

      _beforeMount: function(newOptions){
         var self = this;
         if (newOptions.listModel) {
            this._listModel = newOptions.listModel;
            this._listModel.subscribe('onListChange', function() {
               _private.updateActions(self);
            });
         }
      },

      _beforeUpdate: function(newOptions){
         var self = this;
         if (newOptions.listModel && (this._listModel !== newOptions.listModel)) {
            this._listModel = newOptions.listModel;
            this._listModel.subscribe('onListChange', function() {
               _private.updateActions(self);
            });
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

   ItemActionsController.getDefaultOptions = function() {
      return {
         itemActionsType: 'inline',
         showAction: function(){ return true;}
      }
   };

   return ItemActionsController;
});
