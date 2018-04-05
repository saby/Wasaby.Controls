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
         _size: "l",
         _caption: 'test',
         _style: 'primary',
         _type: 'commonHeader',
         _counterValue: 12,
         _counterStyle: undefined,
         _counterSize: undefined,
         _iconStyle: undefined,
         _separatorIconStyle: undefined,
         _separatorIcon: false,
         _backSize: undefined,
         _backCaption: 'Back',
         _backStyle: undefined,
         _iconSize: undefined,
         _showCaption: true,
         _showCounter: true,
         _showButtonSeparator: true,
         _showSeparator: true,
         _bold: true,

         clickIcon: function (e) {
            this._iconValue = !this._iconValue;
         }
      });
   return ModuleClass;
});