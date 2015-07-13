define('js!SBIS3.TestLinkOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestLinkOnline',
        'css!SBIS3.TestLinkOnline',
        'js!SBIS3.CONTROLS.Link'
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
            outFileName: "regression_link_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
