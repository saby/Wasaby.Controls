define('js!SBIS3.TestCheckBoxOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestCheckBoxOnline',
        'css!SBIS3.TestCheckBoxOnline',
        'js!SBIS3.CONTROLS.CheckBox'
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
            outFileName: "regression_checkbox_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
