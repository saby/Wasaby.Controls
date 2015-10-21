define('js!SBIS3.TestMassOperationsPanelOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestMassOperationsPanelOnline',
        'css!SBIS3.TestMassOperationsPanelOnline',
        'js!SBIS3.CONTROLS.OperationsPanel',
        'js!SBIS3.CONTROLS.DataGrid'
    ], function (CompoundControl, dotTplFn) {

        var moduleClass = CompoundControl.extend({

            _dotTplFn: dotTplFn,

            $protected: {
                _options: {}
            },

            $constructor: function () {
            },

            init: function () {
                moduleClass.superclass.init.call(this);
                var data = this.getChildControlByName('DataGrid 1');
                var panel = this.getChildControlByName('OperationsPanel 1');
                panel.setLinkedView(data);
            }

        });

        moduleClass.webPage = {
            outFileName: "regression_operationspanel_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
