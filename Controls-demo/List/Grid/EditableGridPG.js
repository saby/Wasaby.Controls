define('Controls-demo/List/Grid/EditableGridPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls-demo/List/Grid/resources/DataDemoPG',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/Grid/resources/EditableGridPG/cfg',
      'wml!Controls-demo/List/Grid/resources/DemoMoney',
      'wml!Controls-demo/List/Grid/resources/DemoRating',
      'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem',
      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, MemorySource, data, template, config) {
      'use strict';
       var Component = Control.extend({
           _template: template,
           _content: 'Controls/Grid',

           _beforeMount: function () {
               this._dataObject = {
                   editingConfig: {
                       editorType: 'EditingConfig',
                       value: {
                           editOnClick: true,
                           sequentialEditing: true,
                           toolbarVisibility: false,
                           autoAdd: false
                       }
                   }
               };
               this._componentOptions = {
                   keyProperty: 'id',
                   name: 'EditableGridPG',
                   markedKey: '4',
                   source: new MemorySource({
                       idProperty: 'id',
                       data: data.catalog
                   }),
                   editingConfig: this._dataObject.editingConfig.value,
                   header: data.partialEditableHeader,
                   columns: data.partialEditableColumns
               };

               this._metaData = config[this._content].properties['ws-config'].options;
           }


       });
      return Component;
   });
