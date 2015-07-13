define('js!SBIS3.TestTextArea',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.TestTextArea',
        'css!SBIS3.TestTextArea',
        'js!SBIS3.CONTROLS.TextArea',
        'js!SBIS3.CONTROLS.CheckBox',
        'js!SBIS3.CONTROLS.ComboBox',
        'js!SBIS3.CONTROLS.TextBox'
    ], function (CompoundControl, dotTplFn) {

        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,

            $protected: {
                _options: {
                    test_1: false,
                    test_2: true,
                    test_3: true
                }
            },

            $constructor: function () {
            },

            init: function () {
                var self = this;
                moduleClass.superclass.init.call(this);

                //test 1
                if (this._options.test_1 === false) {
                    $('#client_1').css('display', 'none');
                    this.getChildControlByName('CheckBox 1').setChecked(false);
                } else {
                    this.getChildControlByName('CheckBox 1').setChecked(true);
                    $('#client_1').css('display', 'block');
                }
                this.getChildControlByName('CheckBox 1').subscribe('onCheckedChange', function (eventObject, state) {
                    if (state === false) {
                        $('#client_1').css('display', 'none');
                    } else {
                        $('#client_1').css('display', 'block');
                    }
                });

                //test 2
                if (this._options.test_2 === false) {
                    $('#client_2').css('display', 'none');
                    this.getChildControlByName('CheckBox 2').setChecked(false);
                } else {
                    this.getChildControlByName('CheckBox 2').setChecked(true);
                    $('#client_2').css('display', 'block');
                }
                this.getChildControlByName('CheckBox 2').subscribe('onCheckedChange', function (eventObject, state) {
                    if (state === false) {
                        $('#client_2').css('display', 'none');
                    } else {
                        $('#client_2').css('display', 'block');
                    }
                });

                //test 3
                if (this._options.test_3 === false) {
                    $('#client_3').css('display', 'none');
                    this.getChildControlByName('CheckBox 3').setChecked(false);
                } else {
                    this.getChildControlByName('CheckBox 3').setChecked(true);
                    $('#client_3').css('display', 'block');
                }
                this.getChildControlByName('CheckBox 3').subscribe('onCheckedChange', function (eventObject, state) {
                    if (state === false) {
                        $('#client_3').css('display', 'none');
                    } else {
                        $('#client_3').css('display', 'block');
                    }
                });
            }
        });

        moduleClass.webPage = {
            outFileName: "integration_textarea",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
