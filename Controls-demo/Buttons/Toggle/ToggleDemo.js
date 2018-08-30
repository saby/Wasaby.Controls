define('Controls-demo/Buttons/Toggle/ToggleDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/Buttons/Toggle/ToggleDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var styleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'iconButtonBordered'
         },
         {
            title: 'linkMain'
         },
         {
            title: 'buttonLinkMain'
         },
         {
            title: 'buttonLinkAdditional'
         }
      ]
   });

   var captionsSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'save/change',
            captions: ['save', 'change']
         },
         {
            title: 'on/off',
            captions: ['on', 'off']
         },
         {
            title: 'without caption',
            captions: null
         },
         {
            title: 'single caption',
            captions: ['single caption']
         }
      ]
   });

   var iconsSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'list/tile',
            icons: ['icon-16 icon-ArrangeList', 'icon-16 icon-ArrangePreview']
         },
         {
            title: 'bottomContent/rightContent',
            icons: ['icon-16 icon-ArrangeList04', 'icon-16 icon-ArrangeList03']
         },
         {
            title: 'without icons',
            icons: null
         },
         {
            title: 'single icon',
            icons: ['icon-16 icon-Send']
         }
      ]
   });

   var iconStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default'
         },
         {
            title: 'done'
         },
         {
            title: 'attention'
         },
         {
            title: 'error'
         }
      ]
   });

   var sizeSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 's'
         },
         {
            title: 'm'
         },
         {
            title: 'l'
         }
      ]
   });

   var ModuleClass = Control.extend(
      {
         _template: template,
         _selectedStyle: 'buttonLinkMain',
         _styleSource: styleSource,
         _selectedSize: 'm',
         _sizeSource: sizeSource,
         _captions: null,
         _selectedCaptions: 'without caption',
         _captionsSource: captionsSource,
         _selectedIcons: 'single icon',
         _iconsSource: iconsSource,
         _icons: ['icon-16 icon-Send'],
         _iconStyleSource: iconStyleSource,
         _selectedIconStyle: 'default',
         _tooltip: '',
         _eventName: 'no event',

         clickHandler: function(e) {
            this._eventName = 'click';
         },

         changeIconStyles: function(e, key) {
            this._selectedIconStyle = key;
         },

         changeCaptions: function(e, key) {
            this._selectedCaptions = key;
            var self = this;
            captionsSource.read(key).addCallback(function(item) {
               self._captions = item.get('captions');
            });
         },

         changeIcons: function(e, key) {
            this._selectedIcons = key;
            var self = this;
            iconsSource.read(key).addCallback(function(item) {
               self._icons = item.get('icons');
            });
         },

         changeStyle: function(e, key) {
            this._selectedStyle = key;
         },

         changeSize: function(e, key) {
            this._selectedSize = key;
         },

         reset: function() {
            this._eventName = 'no event';
         }
      });
   return ModuleClass;
});
