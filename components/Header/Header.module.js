define('js!SBIS3.CONTROLS.Header',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.Header',
      'css!SBIS3.CONTROLS.Header'
   ],
   function(CompoundControl, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения заголовков
       * @class SBIS3.CONTROLS.Header
       * @extends SBIS3.CONTROLS.CompoundControl
       * @initial
       * <component data-component="SBIS3.CONTROLS.Header">
       *    <option name="caption">Заголовок</option>
       *    <option name="big">true</option>
       * </component>
       * @author Журавлев Максим Сергеевич
       * */
      var Header = CompoundControl.extend({

         _dotTplFn : dotTplFn,

         $protected : {

            _options : {
               /**
                * @cfg {String} Устанавливает текст заголовка.
                * @example
                * <pre class="brush: xml">
                *    <option name="caption">Заголовок</option>
                * </pre>
                * @see setCaption
                * */
               caption : '',
               /**
                * @cfg {Boolean} Устанавливает размер заголовка, большой или маленький.
                * @example
                * <pre class="brush: xml">
                *    <option name="big">true</option>
                * </pre>
                * @see setBig
                * */
               big : false
            }
         },

         getCaption : function() {
            return this._options.caption;
         },
         /**
          * Устанавливает текст заголовка
          * @param caption Текст
          * */
         setCaption : function(caption) {
            this._options.caption = caption;
            this.getContainer().html(caption);
         },

         getBig : function() {
            return this._options.big;
         },
         /**
          * Устанавливает размер заголовка
          * @param big Большой ли заголовок
          * */
         setBig : function(big) {
            var container = this.getContainer(),
                className= 'controls-Header__big';

            this._options.big = big;
            big ? container.addClass(className) : container.removeClass(className);
         }
      });

      return Header;
   }
);