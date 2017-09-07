/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('js!SBIS3.CONTROLS.OperationPrint', [
   'js!SBIS3.CONTROLS.PrintUnloadBase',
   'js!SBIS3.CONTROLS.Utils.DataProcessor',
   'i18n!SBIS3.CONTROLS.OperationPrint'
], function(PrintUnloadBase, Printer) {
   /**
    * Класс контрола "Кнопка для печати подготовленных данных". Применяется на "Панели действий" (см. {@link SBIS3.CONTROLS.OperationsPanel}).
    * @class SBIS3.CONTROLS.OperationPrint
    * @extends SBIS3.CONTROLS.PrintUnloadBase
    * @author Сухоручкин Андрей Сергеевич
    * @public
    */
   var OperationPrint = PrintUnloadBase.extend(/** @lends SBIS3.CONTROLS.OperationPrint.prototype */{

      $protected: {
         _options: {
            /**
             * @typedef {Object} OperationPrintItem
             * @property {String} icon Устанавливает путь к иконке, отображаемой на кнопке. Отображается в выпадающем меню.
             * @property {String} caption Устанавливает подпись на кнопке. Отображается в выпадающем меню.
             * @translatable caption
             */
            /**
             * @cfg {Array.<OperationPrintItem>} Устанавливает конфигурацию элементов, которые будут отображены в выпадающем меню кнопки.
             * @example
             * <pre>
             * myButton.setItems([
             *    {
             *       caption: 'Печать 1',
             *       icon: 'sprite:icon-24 icon-PDF2 icon-multicolor action-hover'
             *    },
             *    {
             *       caption: 'Печать 2',
             *       icon: 'sprite:icon-24 icon-Excel icon-multicolor action-hover'
             *    }
             * ]);
             * </pre>
             */
            items: [
               {
                  icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
                  title: rk('Распечатать'),
                  linkText: rk('Распечатать'),
                  caption: rk('Распечатать')
               }
            ],
            /**
             * @cfg {String} Устанавливает путь к иконке, отображаемой на кнопке.
             * @remark
             * Список иконок доступен <a href="https://wi.sbis.ru/docs/icons/">здесь</a>.
             */
            icon: 'sprite:icon-24 action-hover icon-Print icon-primary',
            /**
             * @deprecated Опция не используется для конфигурации контрола. Устаревший функционал, недоработка инженера-программиста.
             */
            title: rk('Распечатать'),
            /**
             * @deprecated Опция не используется для конфигурации контрола. Устаревший функционал, недоработка инженера-программиста.
             */
            linkText:  rk('Распечатать'),
            /**
             * @cfg {String} Устанавливает подпись на кнопке.
             * @translatable
             */
            caption: rk('Распечатать'),
            /**
             * @cfg {String} Устанавливает путь до файла, с помощью которого будет произведено xsl-преобразование.
             */
            xsl : undefined,
            /**
             * @cfg (number) Минимальная ширина предварительного окна печати
             */
            minPrintWindowWidth: 0
         }
      },

      $constructor: function() {
      },

      _onOperationActivated: function() {
         this._prepareOperation(rk('Что напечатать'));
      },

      /**
       * @param columns
       * @private
       */
      _notifyOnApply : function(columns, data){
         return this._notify('onApplyOperation', 'print', columns, data);
      },
      applyOperation: function(cfg){
         var p;
         cfg.minWidth = this._options.minPrintWindowWidth;
         if (this._options.xsl) {
            cfg.xsl = this._options.xsl;
            cfg.report = true;
         }
         p = new Printer(cfg);
         p.print();
      }
   });

   return OperationPrint;

});