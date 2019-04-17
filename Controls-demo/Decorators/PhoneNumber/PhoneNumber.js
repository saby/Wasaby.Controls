/**
 * Created by ee.volkova1 on 14.06.2018.
 */
define('Controls-demo/Decorators/PhoneNumber/PhoneNumber',
   [
      'Core/Control',
      'Controls/decorator',
      'wml!Controls-demo/Decorators/PhoneNumber/PhoneNumber',
      'Controls/input',
      'css!Controls-demo/Decorators/PhoneNumber/PhoneNumber'
   ],
   function(Control, decorator, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _number: '',

         _result: '',

         _phoneNumberDecorator: decorator.PhoneNumber
      })
   }
);