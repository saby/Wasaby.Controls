define('js!SBIS3.TestCompositeViewOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestCompositeViewOnline',
        'css!SBIS3.TestCompositeViewOnline',
        'js!SBIS3.CONTROLS.CompositeView'
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
            outFileName: "regression_compositeview_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
