/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup', [
   'Core/Control',
   'Controls/Decorator/Markup/resources/template'
], function(Control,
   template) {
   'use strict';

   var MarkupDecorator = Control.extend({
      _template: template
   });

   return MarkupDecorator;
});
