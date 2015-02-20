/**
 * Модуль "Компонент при наведении на который показывается подсказка".
 *
 * @description
 */
define('js!SBIS3.CORE.InfoboxTrigger',
   [
      'js!SBIS3.CORE.Control',
      'js!SBIS3.CORE.Infobox',
      'html!SBIS3.CORE.InfoboxTrigger'
   ],
   function( Control, Infobox, dotTplFn ) {

   "use strict";

   /**
    * Контрол, при наведении на который показывается подсказка
    * См. {@link $ws.single.Infobox}.
    *
    * @class $ws.proto.InfoboxTrigger
    * @extends $ws.proto.Control 
    */
   $ws.proto.InfoboxTrigger = Control.Control.extend(/** @lends $ws.proto.InfoboxTrigger.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Текст, отображаемый контролом
             * @translatable
             */
            text: '',               //Текст, отображаемый контролом
            /**
             * @cfg {String} Изображение 
             * Путь до картинки, которая отображается рядом с контролом
             */
            img: undefined,
            /**
             * @cfg {String} Позиция изображения
             * Cлева или справа от текста ('left', 'right')
             */
            imgAlign: 'left',
            /**
             * @cfg {String|Function} HTML-текст, отображаемый в подсказке
             * @translatable
             */
            tooltip: '',
            /**
             * @cfg {Number} Ширина блока с подсказкой
             */
            tooltipWidth:undefined,
            /**
             * @cfg {Number} Задержка перед отображением
             */
            showDelay: 200
         },
         _block: undefined          //Блок, содержащий в себе основные элементы
      },
      _dotTplFn: dotTplFn,
      $constructor: function(){
         this._container.addClass('ws-helper');
         this._redraw();
      },
      
      setTooltip: function(tooltip){
         this._options.tooltip = '' + tooltip;
      },

      _redraw: function(){
         if( this._block ) {
            this._block.unbind();
            this._block.remove();
            this._block = null;
         }

         this._block = this._container.find('div:first');
         var self = this;
         this._block.bind('mouseenter', function(){
            var helpText = "";
            if(self._options.tooltip) {
               if(typeof self._options.tooltip == 'function') {
                  try {
                     helpText = self._options.tooltip();
                  } catch (e) {
                     helpText = "Ошибка при получении текста подсказки: " + e.message;
                  }
               } else if(typeof self._options.tooltip == 'string')
                  helpText = self._options.tooltip;
            } else
               helpText = self.getLinkedContext().getValue(self.getName());
            Infobox.show(self._container, helpText, self._options.tooltipWidth, parseInt(self._options.showDelay, 10));
         }).bind('mouseleave', function(){
            Infobox.hide();
         });
      },

      destroy: function() {
         this._block.unbind();
         this._block = null;
         this._container.empty().remove();
         $ws.proto.InfoboxTrigger.superclass.destroy.apply(this, arguments);
      }
   });

   return $ws.proto.InfoboxTrigger;

});
