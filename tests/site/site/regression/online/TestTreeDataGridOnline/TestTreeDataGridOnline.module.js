define('js!SBIS3.TestTreeDataGridOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.PathSelector',
        'html!SBIS3.TestTreeDataGridOnline',
        'css!SBIS3.TestTreeDataGridOnline',
        'js!SBIS3.CONTROLS.TreeDataGrid'
    ], function (CompoundControl, PathSelector, dotTplFn) {

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
            outFileName: "regression_treedatagrid_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
