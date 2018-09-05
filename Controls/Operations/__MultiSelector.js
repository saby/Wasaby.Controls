define('Controls/Operations/__MultiSelector', [
   'Core/Control',
   'tmpl!Controls/Operations/__MultiSelector',
   'WS.Data/Source/Memory',
   'Controls/Container/MultiSelector/SelectionContextField'
], function(Control, template, Memory, SelectionContextField) {
   'use strict';
   var _defaultItems = [{
      id: 'selectAll',
      title: 'Всё'
   }, {
      id: 'unselectAll',
      title: 'Снять'
   }, {
      id: 'toggleAll',
      title: 'Инвертировать'
   }];
   
   var MultiSelector = Control.extend({
      _template: template,
      _multiSelectStatus: undefined,
      _menuCaption: undefined,
      _menuSource: undefined,
      
      _beforeMount: function(newOptions, context) {
         this._menuSource = this._getMenuSource();
         this._updateSelection(context.selection);
      },
      
      _getMenuSource: function() {
         return new Memory({
            idProperty: 'id',
            data: _defaultItems
         });
      },
      
      _beforeUpdate: function(newOptions, context) {
         this._updateSelection(context.selection);
      },
      
      _afterUpdate: function() {
         this._notify('controlResize', [], {bubbling: true});
      },
      
      _updateSelection: function(selection) {
         if (selection.selectedKeys[0] === null && !selection.excludedKeys.length) {
            this._menuCaption = rk('Отмечено всё');
         } else if (selection.selectedKeys.length > 0) {
            this._menuCaption = rk('Отмечено') + ': ' + selection.count;
         } else {
            this._menuCaption = rk('Отметить');
         }
      },
      
      _onMenuItemActivate: function(event, model) {
         this._notify('selectedTypeChanged', [model.get('id')], {
            bubbling: true
         });
      }
   });
   
   MultiSelector.contextTypes = function contextTypes() {
      return {
         selection: SelectionContextField
      };
   };
   
   return MultiSelector;
});
