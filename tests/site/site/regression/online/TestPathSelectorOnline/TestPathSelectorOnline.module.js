define('js!SBIS3.TestPathSelectorOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.PathSelector',
        'html!SBIS3.TestPathSelectorOnline',
        'css!SBIS3.TestPathSelectorOnline',
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
                var data = this.getChildControlByName('TreeDataGrid 1');
                var path = new PathSelector({
                    linkedView: data,
                    element: 'path'
                });
            }

        });

        moduleClass.webPage = {
            outFileName: "regression_pathselector_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
