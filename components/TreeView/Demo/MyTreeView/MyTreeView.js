define('js!SBIS3.CONTROLSs.Demo.MyTreeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLSs.Demo.MyTreeView',
        'css!SBIS3.CONTROLSs.Demo.MyTreeView',
        'js!SBIS3.CONTROLS.TreeView',
        'js!SBIS3.CONTROLS.TreeDataGrid'
    ], function(CompoundControl, dotTplFn) {
    /**
     * SBIS3.CONTROLSs.Demo.MyTreeView
     * @class SBIS3.CONTROLSs.Demo.MyTreeView
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyTreeView.prototype */{
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
