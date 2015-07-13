define('js!SBIS3.TestIconButtonOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestIconButtonOnline',
        'css!SBIS3.TestIconButtonOnline',
        'js!SBIS3.CONTROLS.IconButton'
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
            outFileName: "regression_iconbutton_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
