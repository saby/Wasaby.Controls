define('js!SBIS3.TestProgressBarOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestProgressBarOnline',
        'css!SBIS3.TestProgressBarOnline',
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
            outFileName: "regression_progressbar_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
