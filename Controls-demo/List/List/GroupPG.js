define('Controls-demo/List/List/GroupPG',
   [
      'Core/Control',
      'Types/source',
      'Controls/Constants',
      'Controls-demo/List/List/resources/DataDemoPG',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/List/resources/GroupPG/cfg',
      'wml!Controls-demo/List/List/resources/GroupPG/groupTemplate'
   ],

   function(Control, sourceLib, ControlsConstants, data, template, config) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/List',
         _dataObject: null,
         _componentOptions: null,

         _beforeMount: function() {
            this._dataObject = {
               groupingKeyCallback: {
                  value: 'brand',
                  items: [
                     { id: 1, title: 'brand', template: this._groupByBrand },
                     { id: 2, title: 'year', template: this._groupByYear }
                  ]
               },
               groupTemplate: {
                  value: 'default',
                  items: [
                     {id: 1, title: 'default', template: 'wml!Controls/List/GroupTemplate'},
                     {id: 2, title: 'with right template', template: 'wml!Controls-demo/List/List/resources/GroupPG/groupTemplate'}
                  ]
               }
            };
            this._componentOptions = {
               keyProperty: 'id',
               name: 'GroupListPG',
               markedKey: '3',
               allowEmptySelection: false,
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: data.groupGadgets
               }),
               groupingKeyCallback: this._groupByBrand,
               groupTemplate: 'wml!Controls/List/GroupTemplate',
               collapsedGroups: [],
               dataLoadCallback: this._dataLoadCallback
            };

            this._metaData = config[this._content].properties['ws-config'].options;
         },
         _groupByBrand: function(item) {
            if (item.get('brand') === 'apple') {
               return ControlsConstants.view.hiddenGroup;
            }
            return item.get('brand');
         },
         _groupByYear: function(item) {
            return item.get('year');
         },

         _dataLoadCallback: function(items) {
            items.setMetaData({
               groupResults: {
                  asus: '1555 руб. 00 коп.',
                  acer: '7777 руб. 00 коп.',
                  hp: '2318 руб. 55 коп.',
                  2006: 'silver year',
                  2007: 'gold year',
                  2008: 'platinum year',
                  pop: 'Dancing music',
                  Rock: 'For men',
                  Heavy: 'metal'
               }
            });
         }

      });
      return Component;
   });
