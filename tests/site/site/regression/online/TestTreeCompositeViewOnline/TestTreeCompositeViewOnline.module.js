define('js!SBIS3.TestTreeCompositeViewOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'js!SBIS3.CONTROLS.PathSelector',
        'html!SBIS3.TestTreeCompositeViewOnline',
        'css!SBIS3.TestTreeCompositeViewOnline',
        'js!SBIS3.CONTROLS.TreeCompositeView'
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
            outFileName: "regression_treecompositeview_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
