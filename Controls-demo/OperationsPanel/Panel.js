define('Controls-demo/OperationsPanel/Panel', [
   'Core/Control',
   'tmpl!Controls-demo/OperationsPanel/Panel/Panel',
   'tmpl!Controls-demo/OperationsPanel/Panel/RightTemplate',
   'WS.Data/Source/Memory',
   'css!Controls-demo/OperationsPanel/Panel/Panel'
], function(Control, template, RightTemplate, MemorySource) {
   'use strict';


   var PANEL_ITEMS_FIRST = [{
         id: 'remove',
         icon: 'icon-Erase icon-error',
         '@parent': false,
         title: 'Удалить',
         parent: null
      }, {
         id: 'save',
         icon: 'icon-Save',
         '@parent': true,
         title: 'Выгрузить',
         parent: null
      }, {
         id: 'savePDF',
         '@parent': false,
         title: 'PDF',
         parent: 'save'
      }, {
         id: 'saveExcel',
         '@parent': false,
         title: 'Excel',
         parent: 'save'
      }, {
         id: 'move',
         icon: 'icon-Move',
         '@parent': false,
         title: 'Перенести',
         parent: null
      }],
      PANEL_ITEMS_SECOND = [{
         id: 'merge',
         icon: 'icon-Unite',
         '@parent': false,
         title: 'Объединить',
         parent: null
      }, {
         id: 'read',
         icon: 'icon-WorkRead',
         '@parent': false,
         title: 'Прочитать',
         parent: null
      }, {
         id: 'show',
         icon: 'icon-Show',
         '@parent': false,
         title: 'Поставить на контроль',
         parent: null
      }],
      DEMO_ITEMS = [{
         id: 0,
         title: '0 items'
      }, {
         id: 1,
         title: '3 items'
      }, {
         id: 2,
         title: '6 items'
      }];



   var _private = {
      getPanelSource: function(key) {
         var data = [];
         if (key) {
            data = data.concat(PANEL_ITEMS_FIRST);
         }
         if (key === 2) {
            data = data.concat(PANEL_ITEMS_SECOND);
         }

         return new MemorySource({
            idProperty: 'id',
            data: data
         });
      }
   };

   return Control.extend({
      _template: template,
      _expanded: false,
      _multiSelectorVisibility: true,
      _rightTemplate: true,
      _rightTemplateTpl: RightTemplate,
      _viewSource: new MemorySource({
         idProperty: 'id',
         data: DEMO_ITEMS
      }),
      _sourceConfig: new MemorySource({
         idProperty: 'id',
         data: DEMO_ITEMS
      }),
      _sourceNumber: 1,
      _source: _private.getPanelSource(1),
      sourceChange: function(e, key) {
         this._sourceNumber = key;
         this._source = _private.getPanelSource(key);
      }
   });
});
