define('Controls-demo/Buttons/Toggle/ToggleButtonPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, config) {
      'use strict';
      var SwitchDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _items: null,
         _itemsSimple: null,
         _content: 'Controls/Toggle/Button',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._items = [
               'on', 'off'
            ];
            this._itemsSimple = [
               'first'
            ];
            this._iconList = ['icon-16 icon-ArrangeList', 'icon-16 icon-ArrangePreview'];
            this._bottomContent = ['icon-16 icon-ArrangeList04', 'icon-16 icon-ArrangeList03'];
            this._singleIcon = ['icon-16 icon-Send'];
            this._dataObject = {
               style: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               viewMode: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               size: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 1
               },
               iconStyle: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               icons: {
                  items: [
                     {
                        title: 'list/tile',
                        items: this._iconList
                     },
                     {
                        title: 'bottomContent/rightContent',
                        items: this._bottomContent
                     },
                     {
                        title: 'without icons',
                        items: null
                     },
                     {
                        title: 'single icon',
                        items: this._singleIcon
                     }],
                  value: 'list/tile',
                  showClickEvent: true
               },
               captions: {
                  items: [
                     { id: '1', title: 'On-Off', items: this._items },
                     { id: '2', title: 'Only one', items: this._itemsSimple },
                     { id: '3', title: 'Null', items: null }

                  ],
                  value: 'On-Off'
               }
            };
            this._componentOptions = {
               readOnly: false,
               size: 'm',
               icons: this._iconList,
               iconStyle: 'default',
               viewMode: 'toolButton',
               style: 'secondary',
               tooltip: 'myTooltip',
               captions: this._items,
               name: 'ToggleButton'

            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
