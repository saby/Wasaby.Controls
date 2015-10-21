define('js!SBIS3.TestDataGridOnline2',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestDataGridOnline2',
        'css!SBIS3.TestDataGridOnline2',
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
            }

        });

        moduleClass.webPage = {
            outFileName: "regression_datagrid_online_2",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
