define('js!SBIS3.Demo.Control.MyTreeView', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MyTreeView', 'css!SBIS3.Demo.Control.MyTreeView', 'js!SBIS3.CONTROLS.TreeView', 'js!SBIS3.CONTROLS.TreeDataGrid'], function(CompoundControl, dotTplFn) {
    /**
     * SBIS3.Demo.Control.MyTreeView
     * @class SBIS3.Demo.Control.MyTreeView
     * @extends $ws.proto.CompoundControl
     * @control
     */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyTreeView.prototype */{
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
