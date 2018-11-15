/**
 * Created by ia.kapustin on 27.09.2018.
 */
define('Controls/Input/Lookup/Link', [
   'Core/Control',
   'wml!Controls/Input/Lookup/Link/LookUp_Link',
   'css!Controls/Input/Lookup/Link/LookUp_Link'
], function(Control, template) {
   'use strict';

   var Link = Control.extend({
      _template: template
   });

   Link.getDefaultOptions = function() {
      return {
         viewMode: 'link',
         style: 'secondary'
      };
   };

   return Link;
});
