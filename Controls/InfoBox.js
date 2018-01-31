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

      //Оступы, зависят от стороны, в которую открывается инфобокс
      var VERTICAL_OFFSETS = {
         'top': -14,
         'bottom': 14
      };

      var HORIZONTAL_OFFSETS = {
         'right': -18,
         'left': 18,
         'center': 0
      };

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
               },
               verticalAlign: {
                  side: this._options.verticalAlignSide,
                  offset: VERTICAL_OFFSETS[this._options.verticalAlignSide]
               },
               horizontalAlign: {
                  side: this._options.horizontalAlignSide,
                  //TODO Если таргет по ширине меньше, чем 12 (расстояние до стрелки) + 16 (ширина стрелки), то сдвинем инфобокс, чтобы стрелка указывала точно на точку.
                  offset: target.offsetWidth < 28 ? HORIZONTAL_OFFSETS[this._options.horizontalAlignSide] : 0
               }
            });
         }

      });

      InfoBox.getDefaultOptions = function() {
         return {
            style: 'default',
            targetCorner: {
               vertical: 'top',
               horizontal: 'left'
            },
            horizontalAlignSide: 'right',
            verticalAlignSide: 'top'
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