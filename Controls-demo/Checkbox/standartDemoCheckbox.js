define('Controls-demo/Checkbox/standartDemoCheckbox', [
   'Core/Control',
   'wml!Controls-demo/Checkbox/standartDemoCheckbox',
   'wml!Controls-demo/Checkbox/resources/content1',
   'wml!Controls-demo/Checkbox/resources/content2',
   'wml!Controls-demo/Checkbox/resources/content3',
   'css!Controls-demo/Checkbox/standartDemoCheckbox'
], function (Control, template, content1, content2, content3) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         _content1: content1,
         _content2: content2,
         _content3: content3,
         _value: false,
         _value2: false,
         _value3: false,
         _value4: false,
         _value5: false,
         checkEvent: function(e, checkboxIndex, value) {
            switch (checkboxIndex) {
               case 1:
                  this._value = value;
                  break;
               case 2:
                  this._value2 = value;
                  break;
               case 3:
                  this._value3 = value;
                  break;
               case 4:
                  this._value4 = value;
                  break;
               case 5:
                  this._value5 = value;
                  break;
            }
         }
      });
   return ModuleClass;
});
