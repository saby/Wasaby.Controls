/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.SumDialogTemplate', [
    'js!SBIS3.CORE.CompoundControl',
    'html!SBIS3.CONTROLS.SumDialogTemplate',
    'js!SBIS3.CONTROLS.Button',
    'i18n!SBIS3.CONTROLS.SumDialogTemplate',
    'css!SBIS3.CONTROLS.SumDialogTemplate'
], function(Control, dotTplFn, Button) {

    var SumDialogTemplate = Control.extend({
        _dotTplFn: dotTplFn,

        $protected: {
            _options: {
                name: 'controls-sumDialog',
                resizable: false,
                width: 300,
                title: rk("Суммирование"),
                fields: undefined,
                item: undefined
            }
        }
    });

    return SumDialogTemplate;
});