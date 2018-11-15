define('Controls-demo/EditAtPlace/EditAtPlacePG', [
   'Core/Control',
   'WS.Data/Entity/Record',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/EditAtPlace/EditAtPlacePG',
   'json!Controls-demo/EditAtPlace/EAPConfig',
   'wml!Controls-demo/EditAtPlace/resources/oneField',
   'wml!Controls-demo/EditAtPlace/resources/twoFields',
   'Controls/EditableArea/Templates/Editors/Base',
   'css!Controls-demo/EditAtPlace/EditAtPlacePG'
], function(
   Control,
   Record,
   Memory,
   template,
   config
) {
   'use strict';

   var
      tabsData = [{
         id: '0',
         title: 'Error',
         date: '26.06.18'
      }],
      tabsData2 = [{
         id: '0',
         title: 'Task',
         date: '29.08.18'
      }];

   var EditAtPlacePG = Control.extend({
      _template: template,
      _content: 'Controls/EditAtPlace',

      _beforeMount: function() {
         this._key = 0;
         this._records = [
            new Record({
               rawData: tabsData[0]
            }),
            new Record({
               rawData: tabsData2[0]
            })
         ];
         this._dataObject = {
            editObject: {
               enum: {
                  Error: 'Error',
                  Task: 'Task'
               },
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            content: {
               enum: {
                  'One field': 'wml!Controls-demo/EditAtPlace/resources/oneField',
                  'Group of fields': 'wml!Controls-demo/EditAtPlace/resources/twoFields'
               },
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            style: {
               emptyText: 'none',
               placeholder: 'select',
               keyProperty: 'id',
               displayProperty: 'title'
            }
         };

         this._editWhenFirstRendered = false;
         this._editObject = this._records[0];
         this._contentTemplate = 'wml!Controls-demo/EditAtPlace/resources/oneField';

         this._componentOptions = {
            name: 'EditAtPlace',
            style: '',
            toolbarVisibility: false,
            editWhenFirstRendered: false,
            content: 'wml!Controls-demo/EditAtPlace/resources/oneField',
            editObject: this._records[0]
         };

         this._metaData = config[this._content].properties['ws-config'].options;
      },
      _optionsChangedHandler: function(e, newOptions) {
         var key;

         if (newOptions.componentOpt.editWhenFirstRendered !== this._editWhenFirstRendered) {
            this._editWhenFirstRendered = newOptions.componentOpt.editWhenFirstRendered;
            this._key++;
         }

         if (newOptions.componentOpt.editObject !== this._editObject) {
            key = Object.keys(this._dataObject.editObject.enum).indexOf(newOptions.componentOpt.editObject);
            this._dataObject.editObject.selectedKey = key;
            this._editObject = this._records[key];
            this._componentOptions.editObject = this._editObject;
         }

         if (newOptions.componentOpt.content !== this._contentTemplate) {
            key = Object.keys(this._dataObject.content.enum).indexOf(newOptions.componentOpt.content);
            this._dataObject.content.selectedKey = key;
            this._contentTemplate = this._dataObject.content.enum[newOptions.componentOpt.content];
            this._componentOptions.content = this._contentTemplate;
         }
      }
   });

   return EditAtPlacePG;
});
