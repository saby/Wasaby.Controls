import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import coreMerge = require('Core/core-merge');
import {IoC} from 'Env/Env';

const _private = {
    getStickyConfig(config) {
        config = config || {};
        config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
        config._type = 'sticky'; // TODO: Compatible for compoundArea
        return config;
    }
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:StickyController';

/**
 * Component that opens a popup that is positioned relative to a specified element.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/sticky/ See more}.
 * @class Controls/_popup/Opener/Sticky
 * @extends Controls/_popup/Opener/BaseOpener
 * @mixes Controls/interface/IOpener
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @demo Controls-demo/Popup/Opener/StickyPG
 * @public
 */

const Sticky = BaseOpener.extend({

    /**
     * @typedef {Object} PopupOptions
     * @description Sticky popup options.
     * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
     * @property {Boolean} modal Determines whether the window is modal.
     * @property {String} className Class names of popup.
     * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
     * @property {function|String} template Template inside popup.
     * @property {function|String} templateOptions Template options inside popup.
     * @property {Object} targetPoint Sets the popup build point relative target.
     * @property {Object} direction Sets the alignment of the popup.
     * @property {Object} offset Sets the offset between target and popup.
     * @property {Number} target The maximum width of the panel in a maximized state.
     * @property {Number} minWidth The target relative to which the popup is positioned.
     * @property {Number} maxWidth The minimum width of popup.
     * @property {Number} minHeight The maximum height of popup.
     * @property {Number} maxHeight The maximum height of popup.
     * @property {Number} height The height of popup.
     * @property {Number} width The width of popup.
     * @property {String} fittingMode A method of adjusting the popup panel to the free space next to the target.
     */

    /**
     * Open sticky popup.
     * If you call this method while the window is already opened, it will cause the redrawing of the window.
     * @function Controls/_popup/Opener/Sticky#open
     * @param {PopupOptions[]} popupOptions Sticky popup options.
     * @returns {Undefined}
     * @remark {@link https://wi.sbis.ru/docs/js/Controls/interface/IStickyOptions#popupOptions popupOptions}
     * @example
     * wml
     * <pre>
     *    <Controls.popup:Sticky name="sticky" template="Controls-demo/Popup/TestDialog">
     *          <ws:verticalAlign side="bottom"/>
     *          <ws:horizontalAlign side="left"/>
     *          <ws:corner vertical="bottom" horizontal="left"/>
     *   </Controls.popup:Sticky>
     *
     *   <div name="target">{{_text}}</div>
     *
     *   <Controls.Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
     *   <Controls.Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
     * </pre>
     * js
     * <pre>
     *    Control.extend({
     *       ...
     *
     *       _open() {
     *          var popupOptions = {
     *              target: this._children.target,
     *              opener: this._children.openStickyButton,
     *              templateOptions: {
     *                  record: this._record
     *              }
     *          }
     *          this._children.sticky.open(popupOptions);
     *      }
     *
     *      _close() {
     *          this._children.sticky.close()
     *      }
     *      ...
     *    });
     * </pre>
     * @see close
     */
    open(config) {
        BaseOpener.prototype.open.call(this, _private.getStickyConfig(config), POPUP_CONTROLLER);
    }
});

/**
 * Open Sticky popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/sticky/ See more}.
 * @function Controls/_popup/Opener/Sticky#openPopup
 * @param {PopupOptions[]} config Sticky popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
 * @static
 * @see closePopup
 */
Sticky.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        const newCfg = _private.getStickyConfig(config);
        if (!newCfg.hasOwnProperty('opener')) {
            IoC.resolve('ILogger').error(Sticky.prototype._moduleName, 'Для открытия окна через статический метод, обязательно нужно указать опцию opener');
        }
        BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
            BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
                resolve(popupId);
            });
        });
    });
};

/**
 * Close Sticky popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/sticky/ See more}.
 * @function Controls/_popup/Opener/Sticky#closePopup
 * @param {String} popupId Id of popup.
 * @static
 * @see openPopup
 */
Sticky.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Sticky.getDefaultOptions = function() {
    return coreMerge(BaseOpener.getDefaultOptions(), {});
};
export = Sticky;

/**
 * @name Controls/_popup/Opener/Sticky#close
 * @description Close sticky popup.
 * @function
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *    <Controls.popup:Sticky name="sticky" template="Controls-demo/Popup/TestDialog">
 *          <ws:verticalAlign side="bottom"/>
 *          <ws:horizontalAlign side="left"/>
 *          <ws:corner vertical="bottom" horizontal="left"/>
 *    </Controls.popup:Sticky>
 *
 *    <div name="target">{{_text}}</div>
 *
 *    <Controls.Button name="openStickyButton" caption="open sticky" on:click="_open()"/>
 *    <Controls.Button name="closeStickyButton" caption="close sticky" on:click="_close()"/>
 * </pre>
 * js
 * <pre>
 *   Control.extend({
 *      ...
 *
 *      _open() {
 *          var popupOptions = {
 *              target: this._children.target,
 *              opener: this._children.openStickyButton,
 *              templateOptions: {
 *                  record: this._record
 *              }
 *          }
 *          this._children.sticky.open(popupOptions);
 *      }
 *
 *      _close() {
 *          this._children.sticky.close()
 *      }
 *      ...
 *  });
 *  </pre>
 *  @see open
 */

/**
 * @name Controls/_popup/Opener/Sticky#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/_popup/Opener/Sticky#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/_popup/Opener/Sticky#minHeight
 * @cfg {Number} The minimum height of popup.
 */

/**
 * @name Controls/_popup/Opener/Sticky#maxHeight
 * @cfg {Number} The maximum height of popup.
 */
/**
 * @name Controls/_popup/Opener/Sticky#height
 * @cfg {Number} The height of popup.
 */
/**
 * @name Controls/_popup/Opener/Sticky#width
 * @cfg {Number} The width of popup.
 */

/**
 * @name Controls/_popup/Opener/Sticky#actionOnScroll
 * @cfg {String} Determines the popup action on scroll.
 * @variant close
 * @variant track
 * @variant none
 * @default none
 */
/**
 * @name Controls/_popup/Opener/Sticky#offset
 * @cfg {offset} Point positioning of the target relative to sticky.
 */

/**
 * @name Controls/_popup/Opener/Sticky#targetPoint
 * @cfg {direction} Point positioning of the target relative to sticky.
 */

/**
 * @typedef {Object} direction
 * @property {vertical} vertical
 * @property {horizontal} horizontal
 */

/**
 * @typedef {Enum} vertical
 * @variant top
 * @variant bottom
 */

/**
 * @typedef {Enum} horizontal
 * @variant left
 * @variant right
 */

/**
 * @name Controls/_popup/Opener/Sticky#direction
 * @cfg {direction} Sets the alignment of the popup.
 */

/**
 * @name Controls/_popup/Opener/Sticky#offset
 * @cfg {offset} Sets the offset of the targetPoint.
 *
 * /

 /**
 * @typedef {Object} offset
 * @property {Number} vertical
 * @property {Number} horizontal
 */

/**
 * @name Controls/_popup/Opener/Sticky#fittingMode
 * @cfg {Enum} Определеяет поведение окна, в случае, если оно не помещается на экране с заданным позиционнированием.
 * @variant fixed Позиционнирование не меняется. Уменьшаются размеры окна.
 * @variant overflow Окно сдвигается относительно таргета, если и в этом случае места не хватает, то контент ужимается.
 * @variant adaptive Выбирается способ позиционнирования, при котором на экране сможет уместиться наибольшая часть контента.
 * @default adaptive
 */
