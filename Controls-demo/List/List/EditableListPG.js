define('Controls-demo/List/List/EditableListPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls-demo/List/List/resources/DataDemoPG',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/List/resources/EditableListPG/cfg',
      'wml!Controls-demo/List/List/resources/EditableListPG/itemTemplate'
   ],

   function(Control, MemorySource, data, template, config, ItemTemplate) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/List',
         _dataObject: null,
         _componentOptions: null,

         _beforeMount: function() {
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
               name: 'EditableListPG',
               source: new MemorySource({
                  idProperty: 'id',
                  data: data.gadgets
               }),
               itemTemplate: ItemTemplate,
               editingConfig: this._dataObject.editingConfig.value
            };

            this._metaData = config[this._content].properties['ws-config'].options;
         }


      });
      return Component;
   });
