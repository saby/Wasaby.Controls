define('Controls/Container/Suggest/__PopupContent',
   [
      'Controls/Container/Suggest/__BaseLayer',
      'wml!Controls/Container/Suggest/__PopupContent',
      'css!Controls/Container/Suggest/PopupContent'
   ],
   
   function(BaseLayer, template) {
      
      'use strict';
      
      var __PopupContent = BaseLayer.extend({
         
         _template: template,
         _positionFixed: false,
         _popupOptions: null,
   
         _afterUpdate: function(oldOptions) {
            //need to notify resize after show content, that the popUp recalculated its position
            if (this._options.showContent !== oldOptions.showContent) {
               this._notify('controlResize', [], {bubbling: true});
            }
            
            if (this._options.showContent && !this._positionFixed) {
               this._positionFixed = true;
               this._notify('sendResult', [this._options.stickyPosition], {bubbling: true});
            }
         }
      });
      
      return __PopupContent;
   });


