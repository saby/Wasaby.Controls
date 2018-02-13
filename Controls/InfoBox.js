define('Controls/InfoBox',
   [
      'Core/Control',
      'Core/core-merge',
      'Core/core-clone',
      'tmpl!Controls/InfoBox/resources/contentTemplate',
      'tmpl!Controls/InfoBox/InfoBox',
      'css!Controls/InfoBox/InfoBox'
   ],
   function (Control, cMerge, cClone, contentTemplate, template) {
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

      var ARROW_WIDTH = 18;
      var ARROW_OFFSET = 10;


      var _private = {
        getHorizontalOffset: function(cfg){

           //Если ширина таргета меньше, чем требуется для корректного позиционирования стрелки, то просто будем показывать на центр таргета
           if(cfg.target.offsetWidth < ARROW_WIDTH + ARROW_OFFSET){
              return {
                 'right': -(ARROW_WIDTH + ARROW_OFFSET),
                 'left': ARROW_WIDTH + ARROW_OFFSET,
                 'center': 0
              }[cfg.align.horizontal] + cfg.target.offsetWidth/2 * (cfg.corner.horizontal === 'left' ? 1 : -1);
           }

           switch(cfg.corner.horizontal){
              case 'center':
                 switch(cfg.align.horizontal){
                    case 'left': return ARROW_OFFSET + ARROW_WIDTH/2;
                    case 'right': return -(ARROW_OFFSET + ARROW_WIDTH/2);
                    case 'center': return 0;
                 }
                 break;
              case 'left':
                 switch(cfg.align.horizontal){
                    case 'left': return ARROW_WIDTH + ARROW_OFFSET;
                    case 'right': return 0;
                    case 'center': return ARROW_WIDTH/2;
                 }
                 break;
              case 'right':
                 switch(cfg.align.horizontal){
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
                  offset: _private.getHorizontalOffset(cfg)
               },
               corner: cfg.corner,
               className: 'controls-InfoBox__popup controls-InfoBox-style-' + cfg.style
            });

            this._infoBoxOpened = true;
         }

      });

      return InfoBox;
   }
);