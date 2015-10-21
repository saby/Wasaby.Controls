define('js!SBIS3.TestRadioGroup',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestRadioGroup',
        'css!SBIS3.TestRadioGroup',
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
            outFileName: "integration_radiogroup",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
