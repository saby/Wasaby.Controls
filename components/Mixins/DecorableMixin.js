define('SBIS3.CONTROLS/Mixins/DecorableMixin', [
   'SBIS3.CONTROLS/Utils/HtmlDecorators/HtmlDecorators',
   'SBIS3.CONTROLS/Utils/HtmlDecorators/HighlightDecorator',
   'SBIS3.CONTROLS/Utils/HtmlDecorators/ColorMarkDecorator'
], function (HtmlDecorators, HighlightDecorator, ColorMarkDecorator) {
   'use strict';

   /**
    * Миксин, задающий любому контролу возможность подсветки текста и отметки цветом
    * @mixin SBIS3.CONTROLS/Mixins/DecorableMixin
    * @public
    * @author Крайнов Д.О.
    */

   var DecorableMixin = /** @lends SBIS3.CONTROLS/Mixins/DecorableMixin.prototype */{
      $protected: {
         _options: {
            _decorators: null,
            /**
             * @cfg {Boolean} Использовать подсветку фразы
             * @see isHighlightEnabled
             * @see setHighlightEnabled
             */
            highlightEnabled: false,

            /**
             * @cfg {String} Фраза для подсветки
             * @see getHighlightText
             * @see setHighlightText
             * @translatable
             */
            highlightText: '',

            /**
             * @cfg {Boolean} Использовать отметку цветом
             * @see isColorMarkEnabled
             * @see setColorMarkEnabled
             */
            colorMarkEnabled: false,

            /**
             * @cfg {Boolean} Поле записи, хранящее данные об отметке цветом
             * @see getColorField
             * @see setColorField
             */
            colorField: ''
         }
      },

      around : {
         _modifyOptions : function(parentFnc, cfg) {
            var newArgs = [];
            for (var i = 1; i < arguments.length; i++) {
               newArgs.push(arguments[i]);
            }
            var newCfg = parentFnc.apply(this, newArgs);
            newCfg._decorators = new HtmlDecorators();

            newCfg._decorators.add(new HighlightDecorator({
               enabledGetter: 'isHighlightEnabled',
               textGetter: 'getHighlightText'
            }));

            newCfg._decorators.add(new ColorMarkDecorator({
               enabledGetter: 'isColorMarkEnabled'
            }), 'color');
            return newCfg;
         }
      },


      before: {
         destroy: function () {
            this._options._decorators.destroy();
         },
         redraw: function () {
            this._options._decorators.update(this);
         }
      },
      after: {
         //For DSMixin
         /*_buildTplArgs: function(item, prev) {
            prev.decorators = this._decorators;
            prev.color = this._options.colorField ? item.get(this._options.colorField) : '';
         }*/
      },

      /**
       * Подсветка фразы включена
       * @returns {Boolean}
       */
      isHighlightEnabled: function () {
         return this._options.highlightEnabled;
      },

      /**
       * Включает/выключает подсветку фразы
       * @param {Boolean} enabled Включить/выключить
       * @param {Boolean} [redraw=true] Отрисовать DOM
       */
      setHighlightEnabled: function (enabled, redraw) {
         if (this._options.highlightEnabled === enabled) {
            return;
         }
         this._options.highlightEnabled = enabled;
         if (redraw) {
            this._redraw();
         }
      },

      /**
       * Возвращает фразу для подсветки
       * @returns {String}
       */
      getHighlightText: function () {
         return this._options.highlightText;
      },

      /**
       * Устанавливает фразу для подсветки
       * @param {String} text Фраза для подсветки
       * @param {Boolean} [redraw=true] Отрисовать DOM
       */
      setHighlightText: function (text, redraw) {
         redraw = redraw === undefined ? true : redraw;

         if (this._options.highlightText === text) {
            return;
         }
         this._options.highlightText = text;
         if (redraw) {
            this._redraw();
         }
      },

      /**
       * Отметка цветом включена
       * @returns {Boolean}
       */
      isColorMarkEnabled: function () {
         return this._options.colorMarkEnabled;
      },

      /**
       * Включает/выключает отметку цветом
       * @param {Boolean} enabled Включить/выключить
       */
      setColorMarkEnabled: function (enabled) {
         if (this._options.colorMarkEnabled === enabled) {
            return;
         }
         this._options.colorMarkEnabled = enabled;
         this._redraw();
      },

      /**
       * Возвращает поле записи, хранящее данные об отметке цветом
       * @returns {String}
       */
      getColorField: function () {
         return this._options.colorField;
      },

      /**
       * Устанавливает поле записи, хранящее данные об отметке цветом
       * @param {String} field Название поля
       * @param {Boolean} [redraw=true] Отрисовать DOM
       */
      setColorField: function (field, redraw) {
         redraw = redraw === undefined ? true : redraw;

         if (this._options.colorField === field) {
            return;
         }
         this._options.colorField = field;
         if (redraw) {
            this._redraw();
         }
      }
   };

   return DecorableMixin;
});
