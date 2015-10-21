define('js!SBIS3.TestCheckBoxGroupOnline',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestCheckBoxGroupOnline',
        'css!SBIS3.TestCheckBoxGroupOnline',
        'js!SBIS3.CONTROLS.CheckBoxGroup'
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
            outFileName: "regression_checkboxgroup_online",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
