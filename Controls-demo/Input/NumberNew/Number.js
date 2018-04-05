//TODO переименовать папку после отказа от старых демок https://online.sbis.ru/opendoc.html?guid=a78c50e0-eca2-4ef0-ae2d-3905a7a2159c
define('Controls-demo/Input/NumberNew/Number', [
   'Core/Control',
   'tmpl!Controls-demo/Input/NumberNew/Number',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VdomDemoNumber = Control.extend({
      _template: template,
      _placeholder: '',
      _text1: '',
      _tagStyle: '',
      _integersLength: 5,
      _precision: 2,
      _onlyPositive: true,
      _enabled: true
   });

   return VdomDemoNumber;
});
