define('js!SBIS3.CONTROLS.Demo.MyComboBoxDS',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyComboBoxDS',
        'js!WS.Data/Source/Memory',
        'css!SBIS3.CONTROLS.Demo.MyComboBoxDS',
        'js!SBIS3.CONTROLS.ComboBox'
    ],
    function(CompoundControl, dotTplFn, StaticSource) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            init: function() {
                moduleClass.superclass.init.call(this);
                 var arrayOfObj = [
                     {'@Заметка': 1, 'Содержимое': 'Заказать торт', 'Завершена': false},
                     {'@Заметка': 2, 'Содержимое': 'Украсить комнату', 'Завершена': false},
                     {'@Заметка': 3, 'Содержимое': 'Купить подарок', 'Завершена': true}
                 ];
                 var ds1 = new StaticSource({
                     data: arrayOfObj,
                     idProperty: '@Заметка'
                 });
                 this.getChildControlByName("ComboBox 1").setDataSource(ds1);
            }
        });
        return moduleClass;
    }
);