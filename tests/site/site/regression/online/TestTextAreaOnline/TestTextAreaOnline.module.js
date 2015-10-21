define('js!SBIS3.TestTextAreaOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestTextAreaOnline',
        'css!SBIS3.TestTextAreaOnline',
        'js!SBIS3.CONTROLS.TextArea'
    ], function (CompoundControl, dotTplFn) {

        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,

            $protected: {
                _options: {
                    test_1: false,
                    test_2: true,
                    test_3: true
                }
            },

            $constructor: function () {
            },

            init: function () {
                moduleClass.superclass.init.call(this);
            }
        });

        moduleClass.webPage = {
            outFileName: "regression_textarea_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
