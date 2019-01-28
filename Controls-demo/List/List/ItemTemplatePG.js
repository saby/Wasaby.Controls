define('Controls-demo/List/List/ItemTemplatePG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'Controls-demo/List/List/resources/DataDemoPG',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/List/resources/ItemTemplatePG/cfg',
      'wml!Controls-demo/List/List/resources/ItemTemplatePG/noHighlightOnHover',
      'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateOne',
      'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateTwo',
      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper',
      'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplate'
],

   function(Control, MemorySource, memorySourceFilter, data, template, config) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/List',
         _dataObject: null,
         _componentOptions: null,
         _sourceGadgets: null,

         _beforeMount: function() {

            this._sourceGadgets = new MemorySource({
               idProperty: 'id',
               data: data.gadgets,
               filter: memorySourceFilter()
            });

            this._dataObject = {
               itemTemplateProperty: {
                  items: [
                     { id: 1, title: 'none', value: 'tmp' },
                     { id: 2, title: 'mytemp', value: 'mytemp' },
                     { id: 3, title: 'boldTemplate', value: 'boldTemplate' },
                     { id: 4, title: 'saleTemplate', value: 'saleTemplate' }
                  ],
                  value: 'none'
               },
               itemTemplate: {
                  readOnly: false,
                  value: 'default',
                   items: [
                       {
                           id: '1',
                           title: 'default',
                           value: 'wml!Controls/List/ItemTemplate'
                       },
                       {
                           id: '2',
                           title: 'without highlighting hovered item',
                           value: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/noHighlightOnHover'
                       },
                       {
                           id: '3',
                           title: 'Variant one',
                           value: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateOne'
                       },
                       {
                           id: '4',
                           title: 'Variant two',
                           value: 'wml!Controls-demo/List/List/resources/ItemTemplatePG/CustomItemTemplateTwo'
                       }
                   ]
               }
            };
            this._componentOptions = {
               keyProperty: 'id',
               name: "demoItemTemplateList",
               markedKey: '3',
               allowEmptySelection: false,
               source: this._sourceGadgets,
               itemTemplate: 'wml!Controls/List/ItemTemplate',
               itemTemplateProperty: 'tmp'
            };

            this._metaData = config[this._content].properties['ws-config'].options;
         },


      });
      return Component;
   });
