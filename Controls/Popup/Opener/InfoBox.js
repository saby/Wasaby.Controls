define('Controls/Popup/Opener/InfoBox',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/core-clone',
      'tmpl!Controls/Popup/Opener/InfoBox/resources/template',
      'tmpl!Controls/Popup/Opener/InfoBox/InfoBox',
      'Controls/Popup/Opener/InfoBox/resources/themeConstantsGetter',
      'css!Controls/Popup/Opener/InfoBox/InfoBox'
   ],
   function (Control, cMerge, cClone, contentTpl, template, themeConstantsGetter) {
      'use strict';

      /**
       * Класс открытия всплывающей подсказки с расширенными возможностями
       * @class Controls/Popup/Opener/InfoBox
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @typedef {Object} InfoBoxCfg
       * @property {String} message Сообщение, отображаемое в инфобоксе
       * @property {Style} style Горизонтальное выравнивание инфобокса
       * @property {Boolean} float Должно ли содержимое обтекать крестик закрытия
       * @property {Object} target Таргет, относительно которого неообходимо показать инфобокс
       * @property {Position} position Точка позиционировая инфобокса относительно таргета
       * @property {Function} template Шаблон отображения внутреннего содержимого
       */

      /**
       * @typedef {String} Style
       * @variant default
       * @variant lite
       * @variant help
       * @variant error
       */

      /**
       * @typedef {String} Position
       * @variant tl Всплывающее окно отображается сверху относительно точки построения, выравнивается по левому краю
       * @variant tc Всплывающее окно отображается сверху относительно точки построения, выравнивается по центру
       * @variant tr Всплывающее окно отображается сверху относительно точки построения, выравнивается по правому краю
       * @variant bl Всплывающее окно отображается снизу относительно точки построения, выравнивается по левому краю
       * @variant bc Всплывающее окно отображается снизу относительно точки построения, выравнивается по центру
       * @variant br Всплывающее окно отображается снизу относительно точки построения, выравнивается по правому краю
       * @variant rt Всплывающее окно отображается справа относительно точки построения, выравнивается по верхнему краю
       * @variant rc Всплывающее окно отображается справа относительно точки построения, выравнивается по центру
       * @variant rb Всплывающее окно отображается справа относительно точки построения, выравнивается по нижнему краю
       * @variant lt Всплывающее окно отображается слева относительно точки построения, выравнивается по верхнему краю
       * @variant lc Всплывающее окно отображается слева относительно точки построения, выравнивается по центру
       * @variant lb Всплывающее окно отображается слева относительно точки построения, выравнивается по нижнему краю
       */


      //Получание констант из темы. Эксперементальный способ
      var constants = themeConstantsGetter('controls-InfoBox__themeConstants', {
         ARROW_WIDTH: 'marginLeft',
         ARROW_H_OFFSET: 'marginRight',
         ARROW_V_OFFSET: 'marginBottom',
         TARGET_OFFSET: 'marginTop'
      });

      //Конфигурация инфобокса по умолчанию
      var DEFAULT_CONFIG = {
         position: 'tl',
         style: 'default',
         template: contentTpl,
         float: false
      };

      var SIDES = {
         't': 'top',
         'r': 'right',
         'b': 'bottom',
         'l': 'left',
         'c': 'center'
      };

      var INVERTED_SIDES = {
         't': 'bottom',
         'r': 'left',
         'b': 'top',
         'l': 'right',
         'c': 'center'
      };

      var _private = {

         getOffset: function(targetSize, alignSide, arrowOffset, arrowWidth){
            var align = INVERTED_SIDES[alignSide];

            /*
            * Проверяем, хватает ли нам ширины таргета для правильного позиционирования стрелки, если нет, то просто
            * сдвигаем стрелку инфобокса на центр таргета
            * */
            if(align !== 'center' && targetSize < arrowWidth + arrowOffset){
               switch(align){
                  case 'top':
                  case 'left':
                     return arrowWidth/2 + arrowOffset - targetSize/2;
                  case 'bottom':
                  case 'right':
                     return -arrowWidth/2 + -arrowOffset + targetSize/2;
               }
            }

            return 0;
         },

         getVerticalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetHeight, alignSide,
               constants.ARROW_V_OFFSET, constants.ARROW_WIDTH)
         },

         getHorizontalOffset: function(target, alignSide){
            return _private.getOffset(target.offsetWidth, alignSide,
               constants.ARROW_H_OFFSET, constants.ARROW_WIDTH)
         }

      };

      var InfoBox = Control.extend({
         _template: template,
         _infoBoxOpened: false,

         /**
          * Открыть инфобокс
          * @function Controls/Popup/Opener/InfoBox#open
          * @param {InfoBoxCfg} cfg Объект с настройками инфобокса
          */
         open: function(cfg){

            // Если до этого был открыт инфобокс, закроем его
            if (this._infoBoxOpened) {
               this.close();
            }

            cfg = cMerge(cClone(DEFAULT_CONFIG), cfg);

            var side = cfg.position[0];
            var alignSide = cfg.position[1];
            var topOrBottomSide = side === 't' || side === 'b';

            this._children.opener.open({
               target: cfg.target,
               componentOptions: {
                  template: cfg.template,
                  message: cfg.message,
                  float: cfg.float
               },
               verticalAlign: {
                  side: topOrBottomSide ? SIDES[side] : INVERTED_SIDES[alignSide],
                  offset: topOrBottomSide ?
                     (side === 't' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET) :
                     _private.getVerticalOffset(cfg.target, alignSide)
               },
               horizontalAlign: {
                  side: topOrBottomSide ? INVERTED_SIDES[alignSide] : SIDES[side],
                  offset: topOrBottomSide ?
                     _private.getHorizontalOffset(cfg.target, alignSide) :
                     (side === 'l' ? -constants.TARGET_OFFSET : constants.TARGET_OFFSET)
               },
               corner: {
                  vertical: topOrBottomSide ? SIDES[side] : SIDES[alignSide],
                  horizontal: topOrBottomSide ? SIDES[alignSide] : SIDES[side]
               },
               className: 'controls-InfoBox__popup controls-InfoBox-style-' + cfg.style
            });

            this._infoBoxOpened = true;
         },

         /**
          * Закрыть инфобокс
          * @function Controls/Popup/Opener/InfoBox#close
          */
         close: function(){
            if(this._infoBoxOpened){
               this._children.opener.close();
               this._infoBoxOpened = false;
            }
         }

      });

      InfoBox._private = _private;

      return InfoBox;
   }
);