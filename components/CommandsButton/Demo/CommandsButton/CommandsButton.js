define('js!SBIS3.CONTROLS.Demo.CommandsButton',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.CommandsButton',
        'css!SBIS3.CONTROLS.Demo.CommandsButton',
        'js!SBIS3.CONTROLS.CommandsButton'
    ],
    function(CompoundControl, dotTplFn) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            init: function() {
                moduleClass.superclass.init.call(this);
            }
        });
        return moduleClass;
    }
);