define('js!SBIS3.CONTROLS.Demo.MySpoiler',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MySpoiler',
        'css!SBIS3.CONTROLS.Demo.MySpoiler',
        'js!SBIS3.CONTROLS.Spoiler'
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