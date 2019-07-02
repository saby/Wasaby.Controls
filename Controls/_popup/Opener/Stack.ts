import BaseOpener = require('Controls/_popup/Opener/BaseOpener');
import {IoC} from 'Env/Env';
/**
 * Контрол, открывающий всплывающее окно с пользовательским шаблоном внутри.
 * Всплывающее окно располагается в правой части контентной области приложения и растянуто на всю высоту экрана.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 *
 *  <a href="/materials/demo-ws4-stack-dialog">Demo-example</a>.
 * @class Controls/_popup/Opener/Stack
 * @extends Controls/_popup/Opener/BaseOpener
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @mixes Controls/interface/IOpener
 * @demo Controls-demo/Popup/Opener/StackPG
 * @public
 */

/*
 * Component that opens the popup to the right of content area at the full height of the screen.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 *
 *  <a href="/materials/demo-ws4-stack-dialog">Demo-example</a>.
 * @class Controls/_popup/Opener/Stack
 * @extends Controls/_popup/Opener/BaseOpener
 * @control
 * @author Красильников А.С.
 * @category Popup
 * @mixes Controls/interface/IOpener
 * @demo Controls-demo/Popup/Opener/StackPG
 * @public
 */

 /**
 *@css @size_Stack-border-left   Thickness of left border
 *@css @color_Stack-border-left  Color of left border
 *@css @padding_Stack-shadow     Padding for shadow
 *@css @size_Stack-shadow        Size of shadow
 *@css @color_Stack-shadow       Color of shadow
 */

const _private = {
    getStackConfig(config) {
        config = config || {};
        // The stack is isDefaultOpener by default. For more information, see  {@link Controls/interface/ICanBeDefaultOpener}
        config.isDefaultOpener = config.isDefaultOpener !== undefined ? config.isDefaultOpener : true;
        config._type = 'stack'; // TODO: Compatible for compoundArea
        return config;
    }
};

const POPUP_CONTROLLER = 'Controls/popupTemplate:StackController';

const Stack = BaseOpener.extend({
    /**
     * Метод открытия стековой панели.
     * Повторный вызов этого метода вызовет переририсовку контрола.
     * @function Controls/_popup/Opener/Stack#open
     * @returns {Undefined}
     * @param {PopupOptions[]} popupOptions Конфигурация стековой панели
     * @example
     * В этом примере показано, как открыть и закрыть стековую панель.
     * wml
     * <pre>
     *     <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
     *             <ws:templateOptions key="111"/>
     *     </Controls.popup:Stack>
     *
     *     <Controls.Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
     * </pre>
     * js
     * <pre>
     *     Control.extend({
     *        ...
     *
     *        _openStack() {
     *            var popupOptions = {
     *                autofocus: true
     *            }
     *            this._children.stack.open(popupOptions)
     *        }
     *        ...
     *     });
     * </pre>
     * @see close
     */

    /*
     * Open stack popup.
     * If you call this method while the window is already opened, it will cause the redrawing of the window.
     * @function Controls/_popup/Opener/Stack#open
     * @returns {Undefined}
     * @param {PopupOptions[]} popupOptions Stack popup options.
     */

    open(config) {
        return BaseOpener.prototype.open.call(this, _private.getStackConfig(config), POPUP_CONTROLLER);
    }
});

/**
 * Open Stack popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 * @function Controls/_popup/Opener/Stack#openPopup
 * @param {PopupOptions[]} config Stack popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
 * @static
 * @see closePopup
 */
Stack.openPopup = (config: object): Promise<string> => {
    return new Promise((resolve) => {
        const newCfg = _private.getStackConfig(config);
        if (!newCfg.hasOwnProperty('opener')) {
            IoC.resolve('ILogger').error(Stack.prototype._moduleName, 'Для открытия окна через статический метод, обязательно нужно указать опцию opener');
        }
        BaseOpener.requireModules(newCfg, POPUP_CONTROLLER).then((result) => {
            BaseOpener.showDialog(result[0], newCfg, result[1]).then((popupId: string) => {
                resolve(popupId);
            });
        });
    });
};

/**
 * Close Stack popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 * @function Controls/_popup/Opener/Stack#closePopup
 * @param {String} popupId Id of popup.
 * @static
 * @see openPopup
 */
Stack.closePopup = (popupId: string): void => {
    BaseOpener.closeDialog(popupId);
};

Stack._private = _private;

export = Stack;
/**
 * @typedef {Object} PopupOptions
 * @description Конфигурация стековой панели.
 * @property {Boolean} autofocus Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {Boolean} modal Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {Boolean} closeOnOutsideClick Определяет возможность закрытия всплывающего окна по клику вне.
 * @property {function|String} template Шаблон всплывающего окна
 * @property {function|String} templateOptions Опции для шаблона всплывающего окна
 * @property {Number} minWidth The minimum width of popup.
 * @property {Number} maxWidth The maximum width of popup.
 * @property {Number} width Width of popup.
 */


/*
 * @typedef {Object} PopupOptions
 * @description Stack popup options.
 * @property {Boolean} autofocus Determines whether focus is set to the template when popup is opened.
 * @property {Boolean} modal Determines whether the window is modal.
 * @property {String} className Class names of popup.
 * @property {Boolean} closeOnOutsideClick Determines whether possibility of closing the popup when clicking past.
 * @property {function|String} template Template inside popup.
 * @property {function|String} templateOptions Template options inside popup.
 * @property {Number} minWidth  Минимально допустимая ширина стековой панели.
 * @property {Number} maxWidth Максимально допустимая ширина стековой панели.
 * @property {Number} width Текущая ширина стековой панели.
 */

/**
 * @name Controls/_popup/Opener/Stack#close
 * @description Метод закрытия стековой панели.
 * @returns {Undefined}
 * @example
 * wml
 * <pre>
 *     <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *             <ws:templateOptions key="111"/>
 *     </Controls.popup:Stack>
 *
 *     <Controls.Button name="closeStackButton" caption="close stack" on:click="_closeStack()"/>
 * </pre>
 * js
 * <pre>
 *     Control.extend({
 *        ...
 *        _closeStack() {
 *           this._children.stack.close()
 *        }
 *        ...
 *    });
 * </pre>
 * @see open
 */

/*
 * @name Controls/_popup/Opener/Stack#close
 * @description Close Stack Popup.
 * @returns {Undefined}
 */

/**
 * @name Controls/_popup/Opener/Stack#minWidth
 * @cfg {Number} Минимально допустимая ширина стековой панели.
 */

/*
 * @name Controls/_popup/Opener/Stack#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/_popup/Opener/Stack#maxWidth
 * @cfg {Number} Максимально допустимая ширина стековой панели.
 */

/*
 * @name Controls/_popup/Opener/Stack#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/_popup/Opener/Stack#width
 * @cfg {Number} Текущая ширина стековой панели.
 */

/*
 * @name Controls/_popup/Opener/Stack#width
 * @cfg {Number} Width of popup.
 */
