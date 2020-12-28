define('Controls-demo/Decorators/Number/Number',
   [
      'UI/Base',
      'wml!Controls-demo/Decorators/Number/Number',

      'Controls/input',
      'Controls/decorator',
   ],
   function(Base, template) {

      'use strict';

      var ModuleClass = Base.Control.extend({
         _template: template,

         _number: 0,

         _fractionSize: 0
      });
   
      ModuleClass._styles = ['Controls-demo/Decorators/Number/Number'];

      return ModuleClass;
}
);
