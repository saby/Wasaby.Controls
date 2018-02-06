/**
 * Created by dv.zuev on 02.02.2018.
 */
define('Controls/Application/Compatible', [
   'Core/Control',
   'Core/helpers/Function/runDelayed',
   'tmpl!Controls/Application/Compatible'
], function(Base, 
            runDelayed, 
            template) {
   'use strict';

   var ViewTemplate = Base.extend({
      _template: template
   });

   return ViewTemplate;
});