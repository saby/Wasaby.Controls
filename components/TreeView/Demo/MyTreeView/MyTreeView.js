define('js!SBIS3.Controls.Demo.MyTreeView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.Controls.Demo.MyTreeView',
        'css!SBIS3.Controls.Demo.MyTreeView',
        'js!SBIS3.CONTROLS.TreeView',
        'js!SBIS3.CONTROLS.TreeDataGrid'
    ], function(CompoundControl, dotTplFn) {
    /**
     * SBIS3.Controls.Demo.MyTreeView
     * @class SBIS3.Controls.Demo.MyTreeView
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyTreeView.prototype */{
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
