define('js!SBIS3.CONTROLS.ToggleHeader',
   [
      'js!SBIS3.CONTROLS.ToggleButton',
      'tmpl!SBIS3.CONTROLS.ToggleHeader',
      'css!SBIS3.CONTROLS.ToggleHeader'
   ],
   function(ToggleButton, dotTplFn){

      'use strict';
      /**
       * Контролл для отображения заголовков с функцией сворачивания и разворачивания записей
       * @class SBIS3.CONTROLS.ToggleHeader
       * @extends SBIS3.CONTROLS.ToggleButton
       * @initial
       * <component data-component="SBIS3.CONTROLS.ToggleHeader">
       *    <option name="caption">Заголовок</option>
       *    <option name="count">120</option>
       * </component>
       * @author Крайнов Дмитрий Олегович
       * */
      var ToggleHeader = ToggleButton.extend({
         _dotTplFn: dotTplFn,

         $protected: {
            _options: {
               /**
                * @cfg {Number} Число записей
                * @example
                * <pre class="brush: xml">
                *    <option name="count">120</option>
                * </pre>
                * @see getCount
                * @see setCount
                */
               count: 1
            }
         },

         init: function() {
            ToggleHeader.superclass.init.call(this);

            this.getLinkedContext().setValue('caption', this._options.caption);
            this.setCount(this._options.count);
         },
         /**
          * Вернёт текст заголовка
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myLinkHeader'),
          *       caption = linkHeader.gerCaption();
          * </pre>
          * @see caption
          * @see setCaption
          *
          */
         getCaptiot: function() {
            return this._options.caption;
         },

         /**
          * Изменит текст заголовка
          * @param {String} caption ссылка
          * @example
          * <pre>
          *    var linkHeader = this.getChildControlByName('linkHeader');
          *    linkHeader.setCaption('Заголовок');
          * </pre>
          * @see caption
          * @see getCaption
          */
         setCaption: function(caption) {
            ToggleHeader.superclass.setCaption.call(this);

            this.getLinkedContext().setValue('caption', caption);
         },

         /**
          * Вернёт количество записей
          * @see count
          * @see setCount
          */
         getCount: function() {
            return this._options.count;
         },
         /**
          * Установит количество записей
          * @param count число записей
          * @see count
          * @see getCount
          */
         setCount: function(count) {
            var type;

            count = Number(count);
            type = $ws.helpers.type(count);

            if(type !== 'number' || count < 1) {
               count = '';
            }
            this.getLinkedContext().setValue('count', count);
         }
      });

      return ToggleHeader;
   }
);