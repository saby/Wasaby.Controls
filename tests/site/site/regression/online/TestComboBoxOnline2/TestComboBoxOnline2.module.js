define('js!SBIS3.TestComboBoxOnline2',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestComboBoxOnline2',
        'css!SBIS3.TestComboBoxOnline2',
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
            outFileName: "regression_combobox_online_2",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
