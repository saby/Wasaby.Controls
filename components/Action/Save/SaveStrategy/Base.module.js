/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Base', [
    'Core/Abstract',
    'Core/helpers/fast-control-helpers',
    'js!SBIS3.CONTROLS.Utils.PrintDialogHTMLView',
    'js!SBIS3.CONTROLS.ISaveStrategy',
    'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer'
], function (Abstract, fcHelpers, PrintDialogHTMLView, ISaveStrategy, Serializer) {

    'use strict';

   /**
    * Класс базовой стратегии для сохранения данных.
    * @class SBIS3.CONTROLS.SaveStrategy.Base
    * @extends Core/Abstract
    *
    * @mixes SBIS3.CONTROLS.ISaveStrategy
    *
    * @public
    * @author Сухоручкин А.С.
    */

    var SaveStrategyBase = Abstract.extend([ISaveStrategy], /** @lends SBIS3.CONTROLS.SaveStrategy.Base.prototype */{
        $protected: {
            _options: {
                _defaultXslTransform: 'default-list-transform.xsl'
            }
        },

        /**
         * Сохраняет данные.
         * @param {Object} meta Метаданные.
         * @param {Array} [meta.columns] Колонки списка, которые будут сохраняться.
         * @param {String} [meta.xsl] Имя файла с xsl преобразованием.
         * @param {Number} [meta.minWidth] Минимальная ширина окна печати.
         * @param {WS.Data/Collection/RecordSet} [meta.recordSet] Набор данных, который будет сохранён.
         */
        saveAs: function(meta) {
            this.print(meta);
        },
       /**
        * Выводит данные на печать.
        * @param {Object} meta Метаданные.
        * @param {Array} [meta.columns] Колонки списка, которые будут сохраняться.
        * @param {String} [meta.xsl] Имя файла с xsl преобразованием.
        * @param {Number} [meta.minWidth] Минимальная ширина окна печати.
        * @param {WS.Data/Collection/RecordSet} [meta.recordSet] Набор данных, который будет сохранён.
        */
        print: function (meta) {
            fcHelpers.toggleIndicator(true);
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(reportText){
               PrintDialogHTMLView({
                    htmlText: reportText,
                    minWidth : meta.minWidth,
                    handlers: {
                        onAfterClose: function() {
                            fcHelpers.toggleIndicator(false);
                        }
                    }
                })
            });
        },

        _serializeData: function(recordSet, columns, xsl){
            var serializer = new Serializer({
                columns: columns,
                report: xsl
            });
            return serializer.prepareReport(xsl || this._options._defaultXslTransform, recordSet);
        }

    });

    return SaveStrategyBase;
});
