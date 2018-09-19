define('Controls-demo/EditAtPlace/EditAtPlacePG', [
   'Core/Control',
   'WS.Data/Entity/Record',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/EditAtPlace/EditAtPlacePG',
   'json!Controls-demo/EditAtPlace/EAPConfig',
   'wml!Controls-demo/EditAtPlace/resources/tabTemplate',
   'wml!Controls-demo/EditAtPlace/resources/twoFields',
   'Controls/EditAtPlace/EditAtPlaceTemplate',
   'css!Controls-demo/EditAtPlace/EditAtPlacePG'
], function(
   Control,
   Record,
   Memory,
   template,
   config,
   tabTemplate
) {
   'use strict';

   var
      tabsData = [{
         id: '0',
         title: 'Ошибка в разработку',
         align: 'left',
         number: '1175501898',
         date: '26.06.18',
         itemTemplate: tabTemplate
      }],
      tabsData2 = [{
         id: '0',
         title: 'Задача в разработку',
         align: 'left',
         number: '1175835828',
         date: '29.08.18',
         itemTemplate: tabTemplate
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
         this._tabSources = [
            new Memory({
               idProperty: 'id',
               data: tabsData
            }),
            new Memory({
               idProperty: 'id',
               data: tabsData2
            })
         ];
         this._dataObject = {
            editObject: {
               enum: {
                  'Ошибка в разработку': 'Ошибка в разработку',
                  'Задача в разработку': 'Задача в разработку'
               },
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            content: {
               enum: {
                  'Редактирование текстовых полей': 'Редактирование текстовых полей',
                  'Редактирование текстовых полей во вкладках': 'Редактирование текстовых полей во вкладках'
               },
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            style: {
               items: [{
                  id: 0,
                  title: 'withBackground'
               }]
            }
         };

         this._editWhenFirstRendered = false;
         this._editObject = 'Ошибка в разработку';
         this._contentTemplate = 'wml!Controls-demo/EditAtPlace/resources/twoFields';

         this._componentOptions = {
            name: 'EditAtPlace',
            commitOnDeactivate: false,
            style: '',
            toolbarVisibility: false,
            editWhenFirstRendered: false,
            content: 'wml!Controls-demo/EditAtPlace/resources/twoFields',
            editObject: this._records[0],

            itemTemplateProperty: 'itemTemplate',
            keyProperty: 'id',
            source: this._tabSources[0]
         };

         this._metaData = config[this._content].properties['ws-config'].options;
      },
      _optionsChangedHandler: function(e, newOptions) {
         var key;

         if (newOptions.componentOpt.editWhenFirstRendered !== this._editWhenFirstRendered) {
            this._editWhenFirstRendered = newOptions.componentOpt.editWhenFirstRendered;
            this._key++;
         }

         if (!(newOptions.componentOpt.editObject instanceof Record) && newOptions.componentOpt.editObject !== this._editObject) {
            key = Object.keys(this._dataObject.editObject.enum).indexOf(newOptions.componentOpt.editObject);
            this._dataObject.editObject.selectedKey = key;
            this._editObject = newOptions.componentOpt.editObject;
            this._componentOptions.editObject = this._records[key];
            this._componentOptions.source = this._tabSources[key];
         }

         if (!(newOptions.componentOpt.content.indexOf('wml!') === 0) && newOptions.componentOpt.content !== this._contentTemplate) {
            key = Object.keys(this._dataObject.content.enum).indexOf(newOptions.componentOpt.content);
            this._dataObject.content.selectedKey = key;
            this._contentTemplate = newOptions.componentOpt.content;
            if (this._contentTemplate === 'Редактирование текстовых полей во вкладках') {
               this._content = 'Controls/Tabs/Buttons';
            } else {
               this._content = 'Controls/EditAtPlace';
               this._componentOptions.content = 'wml!Controls-demo/EditAtPlace/resources/twoFields';
            }
            this._key++;
         }
      }
   });

   return EditAtPlacePG;
});
