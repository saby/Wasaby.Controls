define('js!SBIS3.TestButtonOnline6',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestButtonOnline6',
        'css!SBIS3.TestButtonOnline6',
        'js!SBIS3.CONTROLS.ToggleButton',
        'js!SBIS3.CONTROLS.MenuButton',
        'js!SBIS3.CONTROLS.Button'
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
            outFileName: "regression_button_online_6",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
