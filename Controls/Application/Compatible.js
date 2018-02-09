/**
 * Created by dv.zuev on 02.02.2018.
 */
define('Controls/Application/Compatible', [
   'Core/Control',
   'tmpl!Controls/Application/Compatible',
   'tmpl!Controls/Application/CompatibleScripts'
], function(Base, 
            template) {
   'use strict';

   var ViewTemplate = Base.extend({
      _template: template
   });

   return ViewTemplate;
});