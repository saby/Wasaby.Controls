/* global define  */
define('SBIS3.CONTROLS/Action/Save/SaveStrategy/Base', [
    'Core/Abstract',
    'Core/Indicator',
    'SBIS3.CONTROLS/Utils/PrintDialogHTMLView',
    'SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy',
    'browser!SBIS3.CONTROLS/Utils/DataSetToXmlSerializer'
], function (Abstract, Indicator, PrintDialogHTMLView, ISaveStrategy, Serializer) {

    'use strict';

   /**
    * Класс базовой стратегии для сохранения данных.
    * @class SBIS3.CONTROLS/Action/Save/SaveStrategy/Base
    * @extends Core/Abstract
    *
    * @mixes SBIS3.CONTROLS/Action/Save/SaveStrategy/ISaveStrategy
    *
    * @public
    * @author Сухоручкин А.С.
    */

    var SaveStrategyBase = Abstract.extend([ISaveStrategy], /** @lends SBIS3.CONTROLS/Action/Save/SaveStrategy/Base.prototype */{
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
            Indicator.setMessage(rk('Пожалуйста, подождите…'));
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(reportText){
               PrintDialogHTMLView({
                    htmlText: reportText,
                    minWidth : meta.minWidth,
                    handlers: {
                        onAfterClose: function() {
                            Indicator.hide();
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
