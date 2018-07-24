/**
 * Created by ad.chistyakova on 08.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Print', [
   'SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase',
   'SBIS3.CONTROLS/Utils/DataProcessor',
   'i18n!SBIS3.CONTROLS/OperationsPanel/Print'
], function(PrintUnloadBase, Printer) {
   /**
    * Класс контрола "Кнопка для печати подготовленных данных". Применяется на "Панели действий" (см. {@link SBIS3.CONTROLS/OperationsPanel}).
    * @class SBIS3.CONTROLS/OperationsPanel/Print
    * @extends SBIS3.CONTROLS/OperationsPanel/Print/PrintUnloadBase
    * @author Сухоручкин А.С.
    * @deprecated Используйте {@link SBIS3.CONTROLS/Action/Save}.
    * @public
    */
   var OperationPrint = PrintUnloadBase.extend(/** @lends SBIS3.CONTROLS/OperationsPanel/Print.prototype */{

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
             * Список иконок доступен <a href="/docs/icons/">здесь</a>.
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
         //Устанавливам кнопку как родителя в принтер, т.к. принтер показывает диалог
         //предпросмотра и для диалога нужно будет задать правильный opener.
         cfg.parent = this;
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