define('js!Controls/InfoBox',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/InfoBox/InfoBox',
      'css!Controls/InfoBox/InfoBox'
   ],
   function (Control, types, template) {
      'use strict';

      /**
       * Инфобокс
       * @class Controls/InfoBox
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/InfoBox#open
       * Открыть инфобокс
       */

      var InfoBox = Control.extend({
         _template: template,

         _close: function(){
            this._children.opener.close();
         },

         open: function(cfg){
            this._children.opener.open({
               target: cfg.target,
               componentOptions: {
                  message: cfg.message,
                  style: cfg.style
               }
            });

         }

      });

      return InfoBox;
   }
);