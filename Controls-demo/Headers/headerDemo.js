define('Controls-demo/Headers/headerDemo', [
   'Core/Control',
   'tmpl!Controls-demo/Headers/headerDemo',
   'css!Controls-demo/Headers/headerDemo'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _isIconOpen: false,
         _size: "l",
         _caption: 'test',
         _style: 'primary',
         _type: 'commonHeader',
         _counterValue: 12,
         _counterLocation: undefined,
         _counterStyle: undefined,
         _counterSize: undefined,
         _iconLocation: undefined,
         _iconStyle: undefined,
         _openIcon: undefined,
         _closeIcon: undefined,
         _separatorIconStyle: undefined,
         _commonClick: false,
         _separatorIcon: false,
         _iconClickable: false,
         _countClickable: false,
         _clickable: false,
         _backSize: undefined,
         _backCaption: 'Back',
         _backStyle: undefined,
         _inHeader: false,
         _counterIconClick: 0,
         _counterCountClick: 0,
         _iconSize: undefined,
         _showCaption: true,
         _showCounter: true,
         _showButtonSeparator: true,
         _showSeparator: true,


         clickHandler: function (e) {
            console.log('Click');
         },

         clickCount: function (e) {
            this._counterCountClick++;
            console.log('clickCount');
         },

         clickIcon: function (e) {
            this._counterIconClick++;
            console.log('iconCount');
            this._iconValue = !this._iconValue;
         }
      });
   return ModuleClass;
});