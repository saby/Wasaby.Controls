define('Controls-demo/Headers/headerDemo', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Headers/headerDemo',
   'WS.Data/Collection/RecordSet',
   'css!Controls-demo/Headers/headerDemo'
], function (Control,
             MemorySource,
             template) {
   'use strict';

   var headerSizeSource = new MemorySource({
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

   var headerStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default'
         },
         {
            title: 'primary'
         }
      ]
   });

   var counterSizeSource = new MemorySource({
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

   var counterStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default'
         },
         {
            title: 'primary'
         },
         {
            title: 'disabled'
         }
      ]
   });

   var separatorStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'accent'
         },
         {
            title: 'additional'
         },
         {
            title: 'main'
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
            title: 'primary'
         }
      ]
   });

   var backStyleSource = new MemorySource({
      idProperty: 'title',
      data: [
         {
            title: 'default'
         },
         {
            title: 'primary'
         }
      ]
   });

   var backSizeSource = new MemorySource({
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
         _selectedSize: 'm',
         _selectedStyle: 'primary',
         _counterSelectedSize: 'l',
         _counterSelectedStyle: 'default',
         _separatorSelectedStyle: 'accent',
         _iconSelectedStyle: 'default',
         _backSelectedStyle: 'default',
         _backSelectedSize: 'm',
         _backStyleSource: backStyleSource,
         _backSizeSource: backSizeSource,
         _iconStyleSource: iconStyleSource,
         _separatorStyleSource: separatorStyleSource,
         _headerSizeSource: headerSizeSource,
         _headerStyleSource: headerStyleSource,
         _counterSizeSource: counterSizeSource,
         _counterStyleSource: counterStyleSource,
         _caption: 'test',
         _type: 'commonHeader',
         _counterValue: 12,
         _backCaption: 'Back',
         _showCaption: true,
         _showCounter: true,
         _showButtonSeparator: true,
         _showSeparator: true,
         _bold: true,
         _clickedComponent: 'no component',

         clickIcon: function(e) {
            this._iconValue = !this._iconValue;
         },

         clickHandler: function(e, indexOfComponent) {
            switch (indexOfComponent) {
               case 1:
                  this._clickedComponent = 'back-button';
                  break;
               case 2:
                  this._clickedComponent = 'button-separator';
                  break;
               case 3:
                  this._clickedComponent = 'header or header-separator';
                  break;
               case 4:
                  this._clickedComponent = 'counter';
                  break;
            }
         },

         changeSize: function(e, key) {
            this._selectedSize = key;
         },

         changeStyle: function(e, key) {
            this._selectedStyle = key;
         },
         counterChangeSize: function(e, key) {
            this._counterSelectedSize = key;
         },

         counterChangeStyle: function(e, key) {
            this._counterSelectedStyle = key;
         },

         separatorChangeStyle: function(e, key) {
            this._separatorSelectedStyle = key;
         },

         iconChangeStyle: function(e, key) {
            this._iconSelectedStyle = key;
         },

         backChangeStyle: function(e, key) {
            this._backSelectedStyle = key;
         },

         backChangeSize: function(e, key) {
            this._backSelectedSize = key;
         }
      });
   return ModuleClass;
});
