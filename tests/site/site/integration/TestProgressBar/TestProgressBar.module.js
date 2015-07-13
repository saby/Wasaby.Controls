define('js!SBIS3.TestProgressBar',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestProgressBar',
        'css!SBIS3.TestProgressBar',
        'js!SBIS3.CONTROLS.ProgressBar'
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
            outFileName: "integration_progressbar",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
