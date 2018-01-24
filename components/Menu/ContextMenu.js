/**
 * Created by iv.cheremushkin on 13.08.2014.
 */

define('SBIS3.CONTROLS/Menu/ContextMenu', [
    'SBIS3.CONTROLS/Menu',
    'SBIS3.CONTROLS/Mixins/PopupMixin'
], function (Menu, PopupMixin) {

    'use strict';

    /**
     * Контрол, отображающий горизонтальное меню.
     * @class SBIS3.CONTROLS/Menu/ContextMenu
     * @author Крайнов Д.О.
     * @extends SBIS3.CONTROLS/Menu
     * @mixes SBIS3.CONTROLS/Mixins/PopupMixin
     *
     * @control
     * @public
     * @category Button
     */

    var ContextMenu = Menu.extend([PopupMixin], /** @lends SBIS3.CONTROLS/Menu/ContextMenu.prototype */ {

        _modifyOptions: function () {
            var cfg = ContextMenu.superclass._modifyOptions.apply(this, arguments);
            cfg.className += ' controls-Menu__Popup';
            return cfg;
        },

        _itemActivatedHandler: function (id, event) {
            if (!(this._isItemHasChild(id))) {
                this.hide();

                for (var j in this._subMenus) {
                    if (this._subMenus.hasOwnProperty(j)) {
                        this._subMenus[j].hide();
                    }
                }
            }
            this._notify('onMenuItemActivate', id, event);
        },
        _onMenuConfig: function (config) {
            return config;
        },
        _drawItemsCallback: function () {
            ContextMenu.superclass._drawItemsCallback.apply(this, arguments);
            this.recalcPosition(true);
        },

        _isItemHasChild: function(id){
            var itemInstance = this.getItemInstance(id);
            return itemInstance && itemInstance.getContainer().hasClass('controls-Menu__hasChild');
        },

        /* Заглушка, ContextMenu не должно вызывать расчёты авторазмеров, т.к. создаётся абсолютом в body */
        _notifyOnSizeChanged: function () {

        }
    });

    return ContextMenu;

});