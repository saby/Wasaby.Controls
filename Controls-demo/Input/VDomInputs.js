define('Controls-demo/Input/VDomInputs', [
   'Core/Control',
   'tmpl!Controls-demo/Input/VDomInputs',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VDomListView = Control.extend({
      _template: template,

      //стейты, на которые биндим значения инпутов
      _text1: '',
      _text2: '',
      _text3: '',
      _text4: '',

      _area1: '',
      _area2: '',
      _area3: '',
      _area4: '',
      _area5: '',
      _area6: '',
      _area7: '123',
      _area8: '456',

      _number1: '',
      _number2: '',
      _number3: '',
      _number4: '',
      _number5: '',
      _number6: '789',

      _pass1: '',
      _pass2: 'test'
   });

   return VDomListView;
});