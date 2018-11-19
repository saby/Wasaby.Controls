define('Controls/Container/Suggest/__PopupContent',
   [
      'Controls/Container/Suggest/__BaseLayer',
      'wml!Controls/Container/Suggest/__PopupContent'
   ],
   
   function(BaseLayer, template) {
      
      'use strict';
      
      var __PopupContent = BaseLayer.extend({
         
         _template: template
         
      });
      
      return __PopupContent;
   });


