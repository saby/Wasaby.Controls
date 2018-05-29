/**
 * Контрол "Ссылка-меню, открывающая настройщик экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/Link
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/Link',
   [
      'SBIS3.CONTROLS/Menu/MenuLink'/*^^^,
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/Link',
      'css!SBIS3.CONTROLS/ExportCustomizer/Link'*/
   ],

   function (MenuLink/*^^^, tmpl*/) {
      'use strict';

      /**
       * @typedef {object} ExportPreset Тип, содержащий информацию о предустановленных настройках экспорта
       * @property {string|number} id Идентификатор пресета
       * @property {string} title Отображаемое название пресета
       * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
       * @property {string} fileUuid Uuid шаблона форматирования эксель-файла
       */

      var Link = MenuLink.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/Link.prototype*/ {

         /*^^^_dotTplFn: tmpl,*/
         $protected: {
            _options: {
               /**
                * @cfg {Array<ExportPreset>} Список неизменяемых пресетов (предустановленных настроек экспорта) (опционально)
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов (опционально)
                */
               presetNamespace: null,
            },
         },

         _modifyOptions: function () {
            var options = Link.superclass._modifyOptions.apply(this, arguments);
            options.dataSource = new LinkDataSource({
               staticPresets: options.staticPresets,
               presetNamespace: options.presetNamespace
            });
            return options;
         },/*^^^*/

         /*^^^$constructor: function () {
         },*/

         /*^^^init: function () {
            Link.superclass.init.apply(this, arguments);
         },*/

         /*destroy: function () {
            Link.superclass.destroy.apply(this, arguments);
         }*/
      });



      return Link;
   }
);
