/**
 * Created by ia.kapustin on 27.09.2018.
 */
define('Controls/Selector/Lookup/Link', [
   'Core/Control',
   'wml!Controls/Selector/Lookup/Link/LookUp_Link',
   'css!theme?Controls/Selector/Lookup/Link/LookUp_Link'
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
