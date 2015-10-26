define('js!SBIS3.CONTROLS.Utils.HtmlDecorators', ['js!SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator'], function (AbstractDecorator) {
   'use strict';

   /** @constant {Object} Вид области декорирования: текст*/
   var AREA_KIND_TEXT = 'text',
   /** @constant {Object} Вид области декорирования: HTML атрибуты*/
       AREA_KIND_ATTR = 'attr';

   /**
    * Декораторы для HTML - позволяют внедрять обёртки в разметку
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators
    * @public
    * @author Мальцев Алексей Александрович
    */
   var HtmlDecorators = $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Utils.HtmlDecorators.prototype */{
      $protected: {
         /**
          * @var {Object} Набор декораторов SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator[]
          */
         _decorators: {},
         /**
          * @var {Object} Типы зон декорирования
          */
         _kinds: {}
      },

      $constructor: function () {
      },

      destroy: function () {
         for (var area in this._decorators) {
            if (this._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._decorators[area].length; i++) {
                  this._decorators[area][i].destroy();
               }
            }
         }
      },

      /**
       * Добавляет декоратор
       * @param {SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator} decorator Декоратор
       * @param {String} [area=''] Область декорирования
       * @param {String} [kind=HtmlDecorators.AREA_KIND_TEXT] Вид области декорирования
       */
      add: function (decorator, area, kind) {
         area = this._getDefaultArea(area);
         kind = kind || AREA_KIND_TEXT;

         if (this._decorators[area] === undefined) {
            this._decorators[area] = [];
            this._kinds[area] = kind;
         } else if (this._kinds[area] !== kind) {
            throw new Error('Area kind mismatch.');
         }

         this._decorators[area].push(decorator);
      },

      /**
       * Обновляет настройки декораторов контрола
       * @param {Object} control Контрол-владелец декораторов
       */
      update: function(control) {
         for (var area in this._decorators) {
            if (this._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._decorators[area].length; i++) {
                  this._decorators[area][i].update(control);
               }
            }
         }
      },

      /**
       * Применяет декораторы с проверкой условия
       * @param {*} value Значение для декорирования
       * @param {*} condition Условие для проверки
       * @param {String} [area=''] Область декорирования
       * @returns {String}
       */
      applyIf: function (value, condition, area) {
         if (typeof condition === 'object'){
            this.setConditions(condition);
         }
         if (typeof condition === 'function' ? condition(value) : condition) {
            return this.apply(value, area);
         }
      },
      /**
       * Передаем декораторам данные, по значению которых они организуют свою работу
       * @param {Object} obj Объект с данными для декораторов
       * key - название декоратора
       * value - значение, которое хотим передать
       */
      setConditions: function(obj) {
         for (var area in this._decorators) {
            if (this._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._decorators[area].length; i++) {
                  this._decorators[area][i].checkCondition(obj);
               }
            }
         }
      },

      /**
       * Применяет декораторы
       * @param {*} value Значение для декорирования
       * @param {String} [area=''] Область декорирования
       * @returns {*}
       */
      apply: function (value, area) {
         area = this._getDefaultArea(area);

         if (this._kinds[area] === AREA_KIND_ATTR && typeof value !== 'object') {
            throw new Error('The value must be instance of an Object for attribute decorators');
         }

         var decorators = this._getByArea(area);
         for (var i = 0, cnt = decorators.length; i < cnt; i++) {
            if (decorators[i].isEnabled()) {
               value = decorators[i].apply(value);
            }
         }

         return this._render(value, area);
      },

      /**
       * Выполняет рендер значения
       * @param {*} value Отдекорированное значение
       * @param {String} [area=''] Область декорирования
       * @returns {*}
       */
      _render: function (value, area) {
         area = this._getDefaultArea(area);
         if (this._kinds[area] === AREA_KIND_ATTR) {
            var attr = [];
            for (var key in value) {
               if (value.hasOwnProperty(key)) {
                  //TODO: attr value encode
                  attr.push(key + '="' + value[key] + '"');
               }
            }
            return attr.join(' ');
         }

         return  value;
      },

      /**
       * Возвращает декораторы, назначенные на область декорирования
       * @param {String} [area=''] Область декорирования
       * @returns {Array}
       */
      _getByArea: function (area) {
         area = this._getDefaultArea(area);
         if (this._decorators[area]) {
            return this._decorators[area];
         }
         return [];
      },

      /**
       * Возвращает название области декорирования по умолчанию
       * @param {*} area Область декорирования
       * @returns {String}
       */
      _getDefaultArea: function (area) {
         return area || '';
      }
   });

   HtmlDecorators.AREA_KIND_TEXT = AREA_KIND_TEXT;
   HtmlDecorators.AREA_KIND_ATTR = AREA_KIND_ATTR;

   return HtmlDecorators;
});
