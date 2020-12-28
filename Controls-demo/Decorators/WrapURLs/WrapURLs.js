define('Controls-demo/Decorators/WrapURLs/WrapURLs',
   [
      'UI/Base',
      'wml!Controls-demo/Decorators/WrapURLs/WrapURLs',

      'Controls/input',
      'Controls/decorator',
   ],
   function(Base, template) {

      'use strict';

      var ModuleClass = Base.Control.extend({
         _template: template,

         _wrapText: null,

         _inputCompletedHandler: function(event, value) {
            this._wrapText = value;
         }
      });
   
      ModuleClass._styles = ['Controls-demo/Decorators/WrapURLs/WrapURLs'];

      return ModuleClass;
}
);