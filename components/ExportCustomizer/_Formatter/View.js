/**
 * Контрол "Форматирование экспортируемого файла настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Formatter/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Di',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (cObjectIsEqual, CompoundControl, Di, dotTplFn) {
      'use strict';

      /**
       * @typedef {object} ExportFormatterResult Тип, описывающий возвращаемые настраиваемые значения компонента
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       *
       * @see fileUuid
       */

      /**
       * Имя регистрации объекта, предоставляющего методы форматирования шаблона эксель-файла, в инжекторе зависимостей
       * @private
       * @type {string}
       */
      var ExportFormatterName = 'ExportFormatter.Excel';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Formatter/View.prototype*/ {

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Заголовок меню выбора способа форматирования
                */
               menuTitle: rk('Редактировать', 'НастройщикЭкспорта'),
               /**
                * @cfg {Array<string>} Список привязки колонок в экспортируемом файле к полям данных
                */
               fieldIds: null,
               /**
                * @cfg {string} Uuid шаблона форматирования эксель-файла
                */
               fileUuid: null
            },
            // Объект, предоставляющий методы форматирования шаблона эксель-файла
            _exportFormatter: null,
            // Контрол выбора способа форматирования
            _formatterMenu: null,
            // Контрол предпросмотра
            _preview: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._menuItems = [
               {id:'browser', title:'в браузере'},
               {id:'app', title:'в приложении'}
            ];
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._exportFormatter = Di.isRegistered(ExportFormatterName) ? Di.resolve(ExportFormatterName) : null;
            if (this._exportFormatter) {
               this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
               this._preview = this.getContainer().find('.controls-ExportCustomizer-Formatter-View__preview img');
               this._bindEvents();
            }
            else {
               this.setEnabled(false);
               this.setVisible(false);
            }
         },

         _bindEvents: function () {
            /*^^^this.subscribeTo(this._grid, 'on^^^', function (evtName) {
             var ^^^ = ^^^;
             this._options.^^^ = ^^^;
             this.sendCommand('subviewChanged');
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
            var waited = {fieldIds:true, fileUuid:false};
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
            if (has.fieldIds) {
               if (has.fileUuid) {
                  //^^^
               }
               else {
                  //^^^
               }
            }
            else
            if (has.fileUuid) {
               //^^^
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportFormatterResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               fileUuid: options.fileUuid
            };
         }
      });

      return View;
   }
);
