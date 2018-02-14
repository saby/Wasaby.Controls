define('Controls/InfoBoxOpener',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/core-clone',
      'tmpl!Controls/InfoBoxOpener/resources/contentTemplate',
      'tmpl!Controls/InfoBoxOpener/InfoBoxOpener',
      'css!Controls/InfoBoxOpener/InfoBoxOpener'
   ],
   function (Control, cMerge, cClone, contentTemplate, template) {
      'use strict';

      /**
       * Класс открытия всплывающей подсказки с расширенными возможностями
       * @class Controls/InfoBoxOpener
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * Открыть инфобокс
       * @function Controls/InfoBoxOpener#open
       * @param {InfoBoxCfg} cfg Объект с настройками инфобокса
       */

      /**
       * Закрыть инфобокс
       * @function Controls/InfoBoxOpener#close
       */

      /**
       * @typedef {Object} InfoBoxCfg
       * @property {String} message Сообщение, отображаемое в инфобоксе
       * @property {StyleCfg} style Горизонтальное выравнивание инфобокса
       * @property {Object} target Таргет, относительно которого неообходимо показать инфобокс
       * @property {AlignCfg} align Объект с конфигурацией выравнивания
       * @property {CornerCfg} corner Объект с конфигурацией угла таргета, от которого будет строиться инфобокс
       * @property {Function} contentTemplate Шаблон отображения внутреннего содержимого
       */

      /**
       * @typedef {String} StyleCfg
       * @variant default
       * @variant lite
       * @variant help
       * @variant error
       */

      /**
       * @typedef {Object} AlignCfg
       * @property {VerticalAlignEnum} vertical Вертикальное выравнивание инфобокса
       * @property {HorizontalAlignEnum} horizontal Горизонтальное выравнивание инфобокса
       */

      /**
       * @typedef {String} VerticalAlignEnum
       * @variant top Инфобокс отобразится вверх относительно точки построения
       * @variant bottom Инфобокс отобразится вниз относительно точки построения
       */

      /**
       * @typedef {String} HorizontalAlignEnum
       * @variant left Инфобокс отобразится слева относительно точки построения
       * @variant center Инфобокс отобразится по центру относительно точки построения
       * @variant right Инфобокс отобразится справа относительно точки построения
       */

      /**
       * @typedef {Object} CornerCfg
       * @property {VerticalCornerEnum} vertical Вертикальное положение точки
       * @property {HorizontalCornerEnum} horizontal Горизонтальное положение точки
       */

      /**
       * @typedef {String} VerticalCornerEnum
       * @variant top Инфобокс отобразится относительно верхней точки таргета
       * @variant bottom Инфобокс отобразится относительно нижней точки таргета
       */

      /**
       * @typedef {String} HorizontalCornerEnum
       * @variant left Инфобокс отобразится относительно левой точки таргета
       * @variant center Инфобокс отобразится относительно центральной точки таргета
       * @variant right Инфобокс отобразится относительно правой точки таргета
       */


      //Ширина стрелки
      var ARROW_WIDTH = 18;
      //Смещение стрелки от края
      var ARROW_OFFSET = 10;
      //Вертикальное смещение инфобокса с учетом стрелки
      var VERTICAL_OFFSETS = {
         'top': -14,
         'bottom': 14
      };

      var DEFAULT_CONFIG = {
         align: {
            horizontal: 'right',
            vertical: 'top'
         },
         corner: {
            horizontal: 'left',
            vertical: 'top'
         },
         style: 'default',
         contentTemplate: contentTemplate
      };

      var _private = {

         //Вычисляет горизонтальный offset с учетом стрелки
        getHorizontalOffset: function(targetWidth, corner, align){

           //Если ширина таргета меньше, чем требуется для корректного позиционирования стрелки, то просто будем указывать на центр таргета
           if(targetWidth < ARROW_WIDTH + ARROW_OFFSET){
              return {
                 'right': -(ARROW_WIDTH + ARROW_OFFSET),
                 'left': ARROW_WIDTH + ARROW_OFFSET,
                 'center': 0
              }[align.horizontal] + targetWidth/2 * (corner.horizontal === 'left' ? 1 : -1);
           }

           switch(corner.horizontal){
              case 'center':
                 switch(align.horizontal){
                    case 'left': return ARROW_OFFSET + ARROW_WIDTH/2;
                    case 'right': return -(ARROW_OFFSET + ARROW_WIDTH/2);
                    case 'center': return 0;
                 }
                 break;
              case 'left':
                 switch(align.horizontal){
                    case 'left': return ARROW_WIDTH + ARROW_OFFSET;
                    case 'right': return 0;
                    case 'center': return ARROW_WIDTH/2;
                 }
                 break;
              case 'right':
                 switch(align.horizontal){
                    case 'left': return 0;
                    case 'right': return -(ARROW_WIDTH + ARROW_OFFSET);
                    case 'center': return -ARROW_WIDTH/2;
                 }
           }

           return 0;
        }
      };

      var InfoBox = Control.extend({
         _template: template,
         _infoBoxOpened: false,

         close: function(){
            this._children.opener.close();
            this._infoBoxOpened = false;
         },

         open: function(cfg){

            if(this._infoBoxOpened){
               return;
            }

            cfg = cMerge(cClone(DEFAULT_CONFIG), cfg);

            this._children.opener.open({
               target: cfg.target,
               componentOptions: {
                  contentTemplate: cfg.contentTemplate,
                  message: cfg.message
               },
               verticalAlign: {
                  side: cfg.align.vertical,
                  offset: VERTICAL_OFFSETS[cfg.align.vertical]
               },
               horizontalAlign: {
                  side: cfg.align.horizontal,
                  offset: _private.getHorizontalOffset(cfg.target.offsetWidth, cfg.corner, cfg.align)
               },
               corner: cfg.corner,
               className: 'controls-InfoBox__popup controls-InfoBox-style-' + cfg.style
            });

            this._infoBoxOpened = true;
         }

      });

      InfoBox._private = _private;

      return InfoBox;
   }
);