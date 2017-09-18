/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Base', [
    'Core/Abstract',
    'Core/helpers/fast-control-helpers',
    'js!SBIS3.CONTROLS.ISaveStrategy',
    'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer'
], function (Abstract, fcHelpers, ISaveStrategy, Serializer) {

    'use strict';

   /**
    * Базовая стратегия для сохранения данных.
    * @class SBIS3.CONTROLS.SaveStrategy.Base
    * @public
    * @extends Core/Abstract
    * @author Сухоручкин Андрей Сергеевич
    */

    var SaveStrategyBase = Abstract.extend([ISaveStrategy], /** @lends SBIS3.CONTROLS.SaveStrategy.Base.prototype */{
        $protected: {
            _options: {
                _defaultXslTransform: 'default-list-transform.xsl'
            }
        },

        /**
        * @typedef {Object} Meta
        * @property {Array} [columns] Колонки которые будут сохраняться.
        * @property {String} [xsl] Имя файла с xsl преобразованием.
        * @property {Number} [minWidth] Минимальная ширина окна печати.
        * @property {WS.Data/Collection/RecordSet} [recordSet] Набор данных который будет сохранён.
        */
        /**
        * Метод сохранения данных.
        * @param {Meta} meta - Методанные для сохранения.
        * @see SBIS3.CONTROLS.ISaveStrategy
        */
        saveAs: function(meta) {
            this.print(meta);
        },

        print: function (meta) {
            fcHelpers.toggleIndicator(true);
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(reportText){
                fcHelpers.showHTMLForPrint({
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
