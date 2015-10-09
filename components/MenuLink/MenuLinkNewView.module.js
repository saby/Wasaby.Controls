/*global define, $ws, $*/
define('js!SBIS3.CONTROLS.MenuLinkNewView', [
   ],
   function() {
      'use strict';
      var View = $ws.proto.Abstract.extend([],/** @lends SBIS3.CONTROLS.MenuLinkNewView.prototype */ {
         _moduleName: 'SBIS3.CONTROLS.MenuView',
         $protected: {
            _picker: null,
            width_arrow: 10
         },

         setCaption: function(caption) {
            $('.controls-Link__field', this._options.rootNode).html(caption);
            if (this._picker){
               $('.controls-Menu__header-caption', this._picker._container).html(caption);
            }
         },

         setPicker: function(picker){
            this._picker = picker;
         },

         setWidth: function(){
            this._picker.getContainer().css({
               'min-width':  this._options.rootNode.outerWidth() + this._width_arrow // + ширина стрелки
            });
         }

      });
      return View;
   }
);