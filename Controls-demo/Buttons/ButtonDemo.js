define('Controls-demo/Buttons/ButtonDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/Buttons/ButtonDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/resetButton'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var minimumNumberOfSize = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'm'
         },
         {
            title: 'l'
         }
      ]
   });

   var maximumNumberOfSize = new MemorySource({
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
         },
         {
            title: 'xl'
         }
      ]
   });

   var styleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'iconButtonBorderedAdditional',
            sizeSource: minimumNumberOfSize
         },
         {
            title: 'iconButtonBordered',
            sizeSource: minimumNumberOfSize
         },
         {
            title: 'linkMain',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkMain2',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkMain3',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkAdditional',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkAdditional2',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkAdditional3',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkAdditional4',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'linkAdditional5',
            sizeSource: maximumNumberOfSize
         },
         {
            title: 'buttonPrimary',
            sizeSource: minimumNumberOfSize
         },
         {
            title: 'buttonDefault',
            sizeSource: minimumNumberOfSize
         },
         {
            title: 'buttonAdd',
            sizeSource: minimumNumberOfSize
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

   var ModuleClass = Control.extend(
      {
         _template: template,
         _selectedStyle: 'iconButtonBorderedAdditional',
         _styleSource: styleSource,
         _selectedSize: 'm',
         _sizeSource: minimumNumberOfSize,
         _caption: '',
         _icon: 'icon-16 icon-Send',
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

         changeStyle: function(e, key) {
            this._selectedStyle = key;
            var self = this;
            styleSource.read(key).addCallback(function(item) {
               self._sizeSource = item.get('sizeSource');
            });
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
