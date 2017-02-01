/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Base', [
    'Core/Abstract',
    'js!WS.Data/Di',
    'Core/helpers/fast-control-helpers',
    'js!SBIS3.CONTROLS.ISaveStrategy',
    'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer'
], function (Abstract, Di, fcHelpers, ISaveStrategy, Serializer) {

    'use strict';

    var SaveStrategyBase = Abstract.extend([ISaveStrategy], /** @lends SBIS3.CONTROLS.SaveStrategy.Base.prototype */{
        $protected: {
            _options: {
                _defaultXslTransform: 'default-list-transform.xsl'
            }
        },

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

    Di.register('savestrategy.base', SaveStrategyBase);

    return SaveStrategyBase;
});
