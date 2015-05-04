define('js!SBIS3.Demo.Control.MySearchString', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MySearchString', 'css!SBIS3.Demo.Control.MySearchString', 'js!SBIS3.CONTROLS.DataGrid', 'js!SBIS3.CONTROLS.SearchString'], function(CompoundControl, dotTplFn) {
    /**
     * SBIS3.Demo.Control.MySearchString
     * @class SBIS3.Demo.Control.MySearchString
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MySearchString.prototype */{
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {

            }
        },
        $constructor: function() {
        },

        init: function() {
            moduleClass.superclass.init.call(this);
        }
    });
    return moduleClass;
});
