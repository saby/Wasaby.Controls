define('js!SBIS3.TestSwitcher',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestSwitcher',
        'css!SBIS3.TestSwitcher',
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
            outFileName: "integration_switcher",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
