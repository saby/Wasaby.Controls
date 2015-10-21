define('js!TestDataGridEdit',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!TestDataGridEdit',
        'css!TestDataGridEdit',
        'js!SBIS3.CORE.FieldString',
        'js!SBIS3.CORE.FieldLabel',
        'js!SBIS3.CORE.FieldCheckbox',
        'js!SBIS3.CORE.Button'
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
                    this.getChildControlByName('Сохранить').subscribe('onClick', function (eventObject) {
                        this.sendCommand('save')
                    });
                }
            });

        moduleClass.title = 'Редактирование записи в DataGrid';
        moduleClass.dimensions = {
            "autoWidth": false,
            "autoHeight": false,
            "resizable": false,
            "width": 400,
            "height": 229
        };

        return moduleClass;
    });