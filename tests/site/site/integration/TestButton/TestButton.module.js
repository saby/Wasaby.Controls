define('js!SBIS3.TestButton',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestButton',
        'css!SBIS3.TestButton',
        'js!SBIS3.CONTROLS.Button',
        'js!SBIS3.CONTROLS.IconButton',
        'js!SBIS3.CONTROLS.Link',
        'js!SBIS3.CONTROLS.MenuButton'
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
                this.getChildControlByName('Button 1').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert("Вы нажали на Главную кнопку")
                });
                this.getChildControlByName('Button 2').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert("Вы нажали на Простую кнопку")
                });
                this.getChildControlByName('Button 3').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert('Вы нажали на Неактивную кнопку');
                });
                this.getChildControlByName('Link 1').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert('Вы нажали на ссылку');
                });
                this.getChildControlByName('Link 2').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert('Вы нажали на некативную ссылку');
                });
                this.getChildControlByName('Link 3').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert('Вы нажали на ссылку с иконкой');
                });
                this.getChildControlByName('IconButton 1').subscribe('onActivated', function (eventObject) {
                    $ws.core.alert('Вы нажали на кнопку иконку');
                });
                this.getChildControlByName('MenuButton 2').subscribe('onMenuItemActivate', function (eventObject) {
                    $ws.core.alert('Вы нажали на пункт из выпадающего меню');
                });
            }

        });

        moduleClass.webPage = {
            outFileName: "integration_button",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
