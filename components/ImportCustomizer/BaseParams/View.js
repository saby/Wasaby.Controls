/**
 * Контрол "Настройка параметоров импортирования настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/BaseParams/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/BaseParams/View'/*,
      'css!SBIS3.CONTROLS/ImportCustomizer/BaseParams/View'*/
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/BaseParams/View.prototype*/ {

         /**
          * @event change Происходит при измении настраиваемые значения компонента
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} values Настраиваемые значения компонента:
          * @param {object} values.replaceAllData Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
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

         $constructor: function () {
            this._publish('change');
         },

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._replaceAllDataView = this.getChildControlByName('controls-ImportCustomizer-BaseParams-View__replaceAllData');
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._replaceAllDataView, 'onCheckedChange', function (evtName, isChecked) {
               this._options.replaceAllData = isChecked;
               this._notify('change', this.getValues());
            }.bind(this));
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {object}
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
