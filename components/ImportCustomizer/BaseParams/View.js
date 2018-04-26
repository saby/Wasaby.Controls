/**
 * Контрол "Настройка параметоров импортирования настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/BaseParams/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/BaseParams/View'/*,
      'css!SBIS3.CONTROLS/ImportCustomizer/BaseParams/View'*/
   ],

   function (cObjectIsEqual, CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/BaseParams/View.prototype*/ {

         /**
          * @typedef {object} ExportBaseParamsResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {boolean} replaceAllData Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
          * @property {*} destination Место назначения для импортирования (таблица в базе данных и т.п.)
          *
          * @see replaceAllData
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {boolean} Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
                */
               replaceAllData: false,
               /**
                * @cfg {*} Место назначения для импортирования (таблица в базе данных и т.п.)
                */
               destination: null
            },
            // Контрол выбора способа импортирования (полная замена или обновления и дополнения)
            _replaceAllDataView: null
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._replaceAllDataView = this.getChildControlByName('controls-ImportCustomizer-BaseParams-View__replaceAllData');
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._replaceAllDataView, 'onCheckedChange', function (evtName, isChecked) {
               this._options.replaceAllData = isChecked;
               this.sendCommand('subviewChanged');
            }.bind(this));
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
            var waited = {replaceAllData:false, destination:true};
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
            if (has.replaceAllData) {
               this._replaceAllDataView.setChecked(options.replaceAllData);
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportBaseParamsResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               replaceAllData: options.replaceAllData,
               destination: options.destination
            };
         }
      });

      return View;
   }
);
