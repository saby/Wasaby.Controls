define('js!SBIS3.CONTROLS.Demo.MyTreeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyTreeView',
        'css!SBIS3.CONTROLS.Demo.MyTreeView',
        'js!SBIS3.CONTROLS.TreeView',
        'js!SBIS3.CONTROLS.TreeDataGrid'
    ], function(CompoundControl, dotTplFn) {
    /**
     * SBIS3.CONTROLS.Demo.MyTreeView
     * @class SBIS3.CONTROLS.Demo.MyTreeView
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTreeView.prototype */{
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
