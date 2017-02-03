define('js!SBIS3.CONTROLS.Demo.MyRadioGroup',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyRadioGroup',
        'css!SBIS3.CONTROLS.Demo.MyRadioGroup',
        'js!SBIS3.CONTROLS.RadioGroup'
    ],
    function(CompoundControl, dotTplFn) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            $protected: {
                _options: {
                }
            },
            $constructor: function() {
            },

            init: function() {
                moduleClass.superclass.init.call(this);

                // устанавливаем состояние без выбранного элемента коллекции
                this.getChildControlByName('RadioGroup 3').setSelectedKey(null);
            }
        });
        return moduleClass;
    }
);
