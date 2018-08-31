define('Controls/Selector/Tree/Browser', [
   'Core/Control',
   'tmpl!Controls/Selector/Tree/Browser',
   'css!Controls/Selector/Browser'
], function(BaseControl, template) {
   
   
   /**
    * Base class (layout) for creating the registry.
    *
    *
    * @class Controls/Selector/Browser
    * @extends Core/Control
    * @author Герасимов Александр
    * @control
    * @public
    */
   
   'use strict';
   
   var Browser = BaseControl.extend(/** @lends Controls/EngineBrowser.prototype */{
      _template: template,
   });
   
   Browser.getDefaultOptions = function() {
      return {
         selectionType: 'all'
      };
   };
   
   return Browser;
});
