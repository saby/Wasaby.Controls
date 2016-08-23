define('js!SBIS3.CONTROLS.Header',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'html!SBIS3.CONTROLS.Header',
      'css!SBIS3.CONTROLS.Header'
   ],
   function(CompoundControl, dotTplFn, Record){

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
       * @author Крайнов Дмитрий Олегович
       * cssModifier controls-Header__bigHeader Отображает текст как большой заголовок
       * cssModifier controls-Header__subheader Отображает текст как подзаголовок
       * cssModifier controls-Header__bigSubheader Отображает текст как большой подзаголовок
       * */
      var Header = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {String} Устанавливает текст заголовка.
                * @example
                * <pre class="brush: xml">
                *    <option name="caption">Заголовок</option>
                * </pre>
                * @see getCaption
                * @see setCaption
                * */
               caption: ''
            }
         },

         init: function() {
            Header.superclass.init.call(this);

            this.getLinkedContext().setValue('caption', this.getCaption());
         },
         /**
          * Возвращает текст заголовка
          * */
          getCaption: function() {
            return this._options.caption;
         },
         /**
          * Устанавливает текст заголовка
          * @param caption Текст
          * */
         setCaption: function(caption) {
            this._options.caption = caption;
            this.getLinkedContext().setValue('caption', caption);
         }
      });

      return Header;
   }
);