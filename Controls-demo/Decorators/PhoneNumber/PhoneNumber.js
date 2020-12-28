/**
 * Created by ee.volkova1 on 14.06.2018.
 */
define('Controls-demo/Decorators/PhoneNumber/PhoneNumber',
   [
      'UI/Base',
      'Controls/decorator',
      'wml!Controls-demo/Decorators/PhoneNumber/PhoneNumber',
      'Controls/input'
   ],
   function(Base, decorator, template) {

      'use strict';

      return Base.Control.extend({
         _template: template,

         _number: '',

         _result: '',

         _phoneNumberDecorator: decorator.PhoneNumber
      })
   }
);
