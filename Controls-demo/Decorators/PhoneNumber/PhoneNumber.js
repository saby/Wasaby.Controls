/**
 * Created by ee.volkova1 on 14.06.2018.
 */
define('Controls-demo/Decorators/PhoneNumber/PhoneNumber',
   [
      'Core/Control',
      'Controls/Decorator/PhoneNumber',
      'wml!Controls-demo/Decorators/PhoneNumber/PhoneNumber',
      'Controls/Input/Text',
      'css!Controls-demo/Decorators/PhoneNumber/PhoneNumber'
   ],
   function(Control, PhoneNumber, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _number: '',

         _result: '',

         _phoneNumberDecorator: PhoneNumber
      })
   }
);