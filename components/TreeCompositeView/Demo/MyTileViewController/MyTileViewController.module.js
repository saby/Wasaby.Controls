define('js!SBIS3.CONTROLS.Demo.MyTileViewController',
    [
        'js!SBIS3.CORE.CompoundControl',
        'tmpl!SBIS3.CONTROLS.Demo.MyTileViewController',
        'tmpl!SBIS3.CONTROLS.Demo.MyTileViewController/resources/tileTpl',
        'js!SBIS3.CONTROLS.MyTileViewDemoItems',
        'css!SBIS3.CONTROLS.Demo.MyTileViewController',
        'js!SBIS3.CONTROLS.ListView',
        'js!SBIS3.CONTROLS.CompositeView',
        'js!SBIS3.CONTROLS.TreeCompositeView'
    ], function(CompoundControl, dotTplFn, tileTpl, DemoItems) {
   /**
    * SBIS3.CONTROLS.Demo.MyTileViewController
    * @class SBIS3.CONTROLS.Demo.MyTileViewController
    * @extends $ws.proto.CompoundControl
    * @control
    */
    var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTileViewController.prototype */{
        _dotTplFn: dotTplFn,
        $protected: {
            _options: {
                _items: DemoItems,
                _tileTpl: tileTpl,
                _itemsActions: [{
                    name: 'delete',
                    icon: 'sprite:icon-16 icon-Erase icon-error',
                    caption: rk('Удалить'),
                    isMainAction: true
                },{
                    name: 'move',
                    icon: 'sprite:icon-16 icon-Move icon-primary',
                    caption: rk('Перенести'),
                    isMainAction: false
                }],
                _columns: [{
                    field: 'title'
                }]
            },
            _listView: undefined
        },

        init: function() {
            moduleClass.superclass.init.call(this);
        }
    });
    return moduleClass;
});