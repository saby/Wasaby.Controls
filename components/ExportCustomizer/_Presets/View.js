/**
 * Контрол "Форматирование экспортируемого файла настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Presets/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/View',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/item',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Presets/tmpl/footer',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Presets/View'
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportPresetsResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {*} * *
       */



      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Presets/View.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
            },
            // Контрол выбора пресета
            _selector: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._selector = this.getContainer().find('.controls-ExportCustomizer-Presets-View__button');
            this._bindEvents();
         },

         _bindEvents: function () {
            /*^^^this.subscribeTo(this._selector, 'onItemActivate', function (evtName) {
            }.bind(this));*/
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            /*^^^var waited = {xxx:true, yyy:false};
            var has = {};
            for (var name in values) {
               if (name in waited) {
                  var value = values[name];
                  if (waited[name] ? !cObjectIsEqual(value, options[name]) : value !== options[name]) {
                     has[name] = true;
                     options[name] = value;
                  }
               }
            }
            if (has.xxx) {
            }
            else
            if (has.yyy) {
            }*/
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportPresetsResult}
          */
         getValues: function () {
            var options = this._options;
            return {
            };
         }
      });

      return View;
   }
);
