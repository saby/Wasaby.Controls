define('js!SBIS3.TestTextBox3', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.TestTextBox3', 'js!SBIS3.CONTROLS.TextBox'], function (CompoundControl, dotTplFn) {

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
        outFileName: "regression_text_box_online_3",
        htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
    };

    return moduleClass;
});