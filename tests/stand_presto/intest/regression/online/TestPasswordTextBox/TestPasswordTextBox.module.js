define('js!SBIS3.TestPasswordTextBox', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.TestPasswordTextBox', 'js!SBIS3.CONTROLS.PasswordTextBox', 'js!SBIS3.CONTROLS.TextBox'], function (CompoundControl, dotTplFn) {

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
        outFileName: "regression_password_text_box_online",
        htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
    };

    return moduleClass;
});