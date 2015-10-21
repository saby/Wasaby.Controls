define('js!SBIS3.TestSwitcherOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestSwitcherOnline',
        'css!SBIS3.TestSwitcherOnline',
        'js!SBIS3.CONTROLS.Switcher'
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
            outFileName: "regression_switcher_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
