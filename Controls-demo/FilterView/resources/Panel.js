define('Controls-demo/FilterView/resources/Panel',
   [
      'Core/Control',
      'wml!Controls-demo/FilterView/resources/Panel',

      'wml!Controls-demo/FilterView/resources/itemTemplateMainBlock',
      'wml!Controls-demo/FilterView/resources/additionalTemplateItems'
   ],

   function(Control, template) {

      'use strict';
      var FilterViewPanel = Control.extend({

         _template: template,
         _limitWidth: true

      });

      return FilterViewPanel;
   });
