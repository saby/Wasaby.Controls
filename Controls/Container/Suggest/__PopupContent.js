define('Controls/Container/Suggest/__PopupContent',
   [
      'Controls/Container/Suggest/__BaseLayer',
      'wml!Controls/Container/Suggest/__PopupContent'
   ],
   
   function(BaseLayer, template) {
      
      'use strict';
      
      var __PopupContent = BaseLayer.extend({
         
         _template: template,
         
         _beforeMount: function(options) {
            this.setLayerContext(options);
         },
         
         _beforeUpdate: function(newOptions) {
            this.updateLayerContext(newOptions);
         },
         
         _getChildContext: function() {
            return this.getLayerContext();
         }
      });
      
      return __PopupContent;
   });


