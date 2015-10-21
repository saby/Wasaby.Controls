define('js!SBIS3.TestComboBox',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestComboBox',
        'css!SBIS3.TestComboBox',
        'js!SBIS3.CONTROLS.ComboBox'
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
            outFileName: "integration_combobox",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
