/**
 * Контрол "Форматирование экспортируемого файла настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_Formatter/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_Formatter/View'
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_Formatter/View.prototype*/ {

         /**
          * @typedef {object} ExportFormatterResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {string} fileUrl Урл файла с результатом форматирования
          * @property {string} previewUrl Урл для предпросмотра результата форматирования
          *
          * @see fileUrl
          * @see previewUrl
          */

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
                * @cfg {string} Урл файла с результатом форматирования
                */
               fileUrl: null,
               /**
                * @cfg {string} Урл для предпросмотра результата форматирования
                */
               previewUrl: null
            },
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
            this._formatterMenu = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__formatterMenu');
            this._preview = this.getChildControlByName('controls-ExportCustomizer-Formatter-View__preview');
            this._bindEvents();
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
            //^^^
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
               fileUrl: options.fileUrl,
               previewUrl: options.previewUrl
            };
         }
      });

      return View;
   }
);
