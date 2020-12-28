define('Controls-demo/Decorators/Decorators',
   [
      'UI/Base',
      'wml!Controls-demo/Decorators/Decorators',

      'Controls-demo/Decorators/Money/Money',
      'Controls-demo/Decorators/Number/Number',
      'Controls-demo/Decorators/PhoneNumber/PhoneNumber',
      'Controls-demo/Decorators/WrapURLs/WrapURLs',
   ],
   function(Base, template) {

      'use strict';

      var ModuleClass = Base.Control.extend({
         _template: template
      })
   
      ModuleClass._styles = ['Controls-demo/Decorators/Decorators'];

      return ModuleClass;
}
);