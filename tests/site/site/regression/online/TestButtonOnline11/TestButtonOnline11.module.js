define('js!SBIS3.TestButtonOnline11',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestButtonOnline11',
        'css!SBIS3.TestButtonOnline11',
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
            outFileName: "regression_button_online_11",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
