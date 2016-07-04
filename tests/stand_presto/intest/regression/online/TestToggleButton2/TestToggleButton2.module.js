define('js!SBIS3.TestToggleButton2', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.TestToggleButton2', 'js!SBIS3.CONTROLS.ToggleButton', 'js!SBIS3.CONTROLS.TextBox'], function (CompoundControl, dotTplFn) {

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
        outFileName: "regression_toggle_button_online_2",
        htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
    };

    return moduleClass;
});