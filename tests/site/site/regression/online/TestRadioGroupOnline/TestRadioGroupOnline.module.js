define('js!SBIS3.TestRadioGroupOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestRadioGroupOnline',
        'css!SBIS3.TestRadioGroupOnline',
        'js!SBIS3.CONTROLS.RadioGroup'
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
            outFileName: "regression_radiogroup_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
