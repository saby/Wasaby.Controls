define('Controls/Container/Suggest/__PopupContent',
   [
      'Controls/Container/Suggest/__BaseLayer',
      'wml!Controls/Container/Suggest/__PopupContent'
   ],
   
   function(BaseLayer, template) {
      
      'use strict';
      
      var __PopupContent = BaseLayer.extend({
         
         _template: template,
   
         _afterUpdate: function(oldOptions) {
            //need to notify resize after show content, that the popUp recalculated its position
            if (this._options.showContent !== oldOptions.showContent) {
               this._notify('controlResize', [], {bubbling: true});
            }
         }
      });
      
      return __PopupContent;
   });


