define('js!SBIS3.TestCheckBoxGroup',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestCheckBoxGroup',
        'css!SBIS3.TestCheckBoxGroup',
        'js!SBIS3.CONTROLS.CheckBoxGroup',
        'js!SBIS3.CONTROLS.CheckBox',
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
            outFileName: "integration_checkboxgroup",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
