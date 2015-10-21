define('js!SBIS3.TestButtonOnline2',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestButtonOnline2',
        'css!SBIS3.TestButtonOnline2',
        'js!SBIS3.CORE.Button',
        'js!SBIS3.CONTROLS.Button',
        'js!SBIS3.CONTROLS.MenuButton',
        'js!SBIS3.CONTROLS.ToggleButton'
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
            outFileName: "regression_button_online_2",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
