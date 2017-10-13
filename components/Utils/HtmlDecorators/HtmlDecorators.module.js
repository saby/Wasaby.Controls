define('js!SBIS3.CONTROLS.Utils.HtmlDecorators', [
   "Core/core-extend",
   "WS.Data/Utils"
], function ( cExtend, Utils) {
   'use strict';

   /** @constant {Object} Вид области декорирования: текст*/
   var AREA_KIND_TEXT = 'text',
   /** @constant {Object} Вид области декорирования: HTML атрибуты*/
       AREA_KIND_ATTR = 'attr';

   /**
    * Декораторы для HTML - позволяют внедрять обёртки в разметку
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var HtmlDecorators = cExtend({}, /** @lends SBIS3.CONTROLS.Utils.HtmlDecorators.prototype */{
      $protected: {
         /**
          * @var {Object} Типы зон декорирования
          */
         _kinds: {},
         _options: {
            _decorators: {}
         }
      },

      $constructor: function () {
      },

      destroy: function () {
         for (var area in this._options._decorators) {
            if (this._options._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._options._decorators[area].length; i++) {
                  this._options._decorators[area][i].destroy();
               }
            }
         }
      },

      /**
       * Добавляет декоратор
       * @param {SBIS3.CONTROLS.Utils.HtmlDecorators.AbstractDecorator} decorator Декоратор
       * @param {String} [area=''] Область декорирования
       * @param {String} [kind=HtmlDecorators.AREA_KIND_TEXT] Вид области декорирования
       */
      add: function (decorator, area, kind) {
         area = this._getDefaultArea(area);
         kind = kind || AREA_KIND_TEXT;

         if (this._options._decorators[area] === undefined) {
            this._options._decorators[area] = [];
            this._kinds[area] = kind;
         } else if (this._kinds[area] !== kind) {
            throw new Error('Area kind mismatch.');
         }

         this._options._decorators[area].push(decorator);
      },

      getByName: function (decoratorName) {
         for (var area in this._options._decorators) {
            if (this._options._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._options._decorators[area].length; i++) {
                  if (this._options._decorators[area][i].getName() == decoratorName){
                     return this._options._decorators[area][i];
                  }
               }
            }
         }
      },

      /**
       * Обновляет настройки декораторов контрола
       * @param {Object} control Контрол-владелец декораторов
       */
      update: function(control) {
         for (var area in this._options._decorators) {
            if (this._options._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._options._decorators[area].length; i++) {
                  this._options._decorators[area][i].update(control);
               }
            }
         }
      },

      /**
       * @deprecated Опция не поддерживается с 3.7.3.100, вместо нее используйте {@link applyOnly}
       */
      applyIf: function (value, condition, area) {
         Utils.logger.stack('SBIS3.CONTROLS.Utils.HtmlDecorators Опция applyIf не поддерживается с 3.7.3.100, вместо нее используйте applyOnly', 1);
         return this.applyOnly.apply(this, arguments);
      },
      /**
       * Вызывает только указанные декораторы
       * @param {String} value Значение для декорирования
       * @param {Object} condition Объект, свойствами которого являются имена декораторов, которые хотим запустить.
       * Значения свойств - данные, передаваемые в конкретный декоратор
       * @returns {String}
       */
      applyOnly:  function (value, condition) {
         var enabledDecorators = [];
         if (typeof condition === 'object'){
            enabledDecorators = this.setConditions(condition);
            return this._applyDecorators(value, '', enabledDecorators);
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
         var enabledDecorators = [];
         for (var area in this._options._decorators) {
            if (this._options._decorators.hasOwnProperty(area)) {
               for (var i = 0; i < this._options._decorators[area].length; i++) {
                  if (this._options._decorators[area][i].checkCondition(obj)){
                     enabledDecorators.push(this._options._decorators[area][i]);
                  }
               }
            }
         }
         return enabledDecorators;
      },

      /**
       * Применяет декораторы
       * @param {*} value Значение для декорирования
       * @param {String} [area=''] Область декорирования
       * @returns {*}
       */
      apply: function (value, area) {
         if (this._kinds[area] === AREA_KIND_ATTR && typeof value !== 'object') {
            throw new Error('The value must be instance of an Object for attribute decorators');
         }

         return this._applyDecorators(value, area);
      },

      _applyDecorators: function(value, area, enabledDecorators){
         area = this._getDefaultArea(area);
         var decorators = enabledDecorators || this._getByArea(area);
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
         if (this._options._decorators[area]) {
            return this._options._decorators[area];
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
