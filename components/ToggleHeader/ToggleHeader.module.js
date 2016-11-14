define('js!SBIS3.CONTROLS.ToggleHeader',
   [
      'js!SBIS3.CONTROLS.ToggleButton',
      'tmpl!SBIS3.CONTROLS.ToggleHeader',
      'Core/helpers/helpers'
   ],
   function(ToggleButton, dotTplFn, Helpers){

      'use strict';
      /**
       * Контрол для отображения кликабельных заголовков с функцией сворачивания
       * и разворачивания записей, имеющий счётчик слева от текста заголовка.
       * @class SBIS3.CONTROLS.ToggleHeader
       * @demo SBIS3.CONTROLS.Demo.MyToggleHeader
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
                * @cfg {Number} Значение счётчика
                * @example
                * <pre class="brush: xml">
                *    <option name="count">120</option>
                * </pre>
                * @see getCount
                * @see setCount
                */
               count: undefined
            }
         },

         /**
          * Получить текст заголовка
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myToggleHeader'),
          *       caption = linkHeader.gerCaption();
          * </pre>
          * @see caption
          * @see setCaption
          */
         getCaption: function() {
            return this._options.caption;
         },

         /**
          * Изменить текст заголовка
          * @param {String} caption ссылка
          * @example
          * <pre>
          *    var linkHeader = this.getChildControlByName('myToggleHeader');
          *    linkHeader.setCaption('Заголовок');
          * </pre>
          * @see caption
          * @see getCaption
          */
         setCaption: function(caption) {
            ToggleHeader.superclass.setCaption.call(this, caption);

            this.getLinkedContext().setValueSelf('caption', caption);
         },

         /**
          * Получить значение счётчика
          * @example
          * <pre>
          *    var
          *       linkHeader = this.getChildControlByName('myToggleHeader'),
          *       count = linkHeader.getCount();
          * </pre>
          * @see count
          * @see setCount
          */
         getCount: function() {
            return this._options.count;
         },
         /**
          * Изменить значение счётчика
          * @param {Number} count значение счётчика
          * @example
          * <pre>
          *    var linkHeader = this.getChildControlByName('myToggleHeader');
          *    linkHeader.setCount(120);
          * </pre>
          * @see count
          * @see getCount
          */
         setCount: function(count) {
            var
               type,
               context = this.getLinkedContext();

            count = Number(count);
            type = Helpers.type(count);

            if(type !== 'number' || count < 1) {
               count = '';
            }

            this._options.count = count;
            context.setValueSelf('count', '' + count);
         }
      });

      return ToggleHeader;
   }
);