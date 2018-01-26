define('Controls/InfoBox',
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
       * Открыть инфобокс
       * @function Controls/InfoBox#open
       * @param message Сообщение отображаемое внутри инфобокса
       * @param target Элемент, относительно которого будет показываться инфобокс
       */

      /**
       * Спрятать инфобокс
       * @function Controls/InfoBox#close
       */

      var InfoBox = Control.extend({
         _template: template,

         close: function(){
            this._children.opener.close();
         },

         open: function(message, target){
            this._children.opener.open({
               target: target,
               componentOptions: {
                  message: message
               }
            });
         }

      });

      InfoBox.getDefaultOptions = function() {
         return {
            style: 'default'
         };
      };

      InfoBox.getOptionTypes = function() {
         return {
            style: types(String).oneOf([
               'default',
               'lite',
               'help',
               'error'
            ])
         };
      };

      return InfoBox;
   }
);