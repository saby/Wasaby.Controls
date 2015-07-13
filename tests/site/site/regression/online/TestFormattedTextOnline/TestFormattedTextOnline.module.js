define('js!SBIS3.TestFormattedTextOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestFormattedTextOnline',
        'css!SBIS3.TestFormattedTextOnline',
        'js!SBIS3.CONTROLS.FormattedTextBox'
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
            outFileName: "regression_formattedtextbox_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
