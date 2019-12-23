import { IOpener, IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';

/**
 * Интерфейс для опций стековых окон.
 *
 * @interface Controls/_popup/interface/IStack
 * @public
 * @author Красильников А.С.
 */

export interface IStackPopupOptions extends IBasePopupOptions {
    minWidth?: number;
    width?: number;
    maxWidth?: number;
    propStorageId?: number;
}

export interface IStackOpener extends IOpener {
    readonly '[Controls/_popup/interface/IStackOpener]': boolean;
}

/**
 * Метод открытия стековой панели.
 * Повторный вызов этого метода вызовет переририсовку контрола.
 * @function Controls/_popup/interface/IStack#open
 * @param {PopupOptions} popupOptions Конфигурация стековой панели
 * @remark
 * Если требуется открыть окно, без создания popup:Stack в верстке, следует использовать статический метод {@link openPopup}.
 * @example
 * В этом примере показано, как открыть и закрыть стековую панель.
 * wml
 * <pre>
 *     <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *             <ws:templateOptions key="111"/>
 *     </Controls.popup:Stack>
 *
 *     <Controls.buttons:Button name="openStackButton" caption="open stack" on:click="_openStack()"/>
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
 * @see openPopup
 * @see closePopup
 */

/*
 * Open stack popup.
 * If you call this method while the window is already opened, it will cause the redrawing of the window.
 * @function Controls/_popup/interface/IStack#open
 * @returns {Undefined}
 * @param {PopupOptions} popupOptions Stack popup options.
 */

/**
 * @name Controls/_popup/interface/IStack#close
 * @description Метод закрытия стековой панели.
 * @example
 * wml
 * <pre>
 *     <Controls.popup:Stack name="stack" template="Controls-demo/Popup/TestStack" modal="{{true}}">
 *             <ws:templateOptions key="111"/>
 *     </Controls.popup:Stack>
 *
 *     <Controls.buttons:Button name="closeStackButton" caption="close stack" on:click="_closeStack()"/>
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
 * @name Controls/_popup/interface/IStack#close
 * @description Close Stack Popup.
 */



/**
 * Статический метод для открытия стекового окна. При использовании метода не требуется создавать popup:Stack в верстке.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ Подробнее}.
 * @function Controls/_popup/interface/IStack#openPopup
 * @param {PopupOptions} config Конфигурация стекового окна
 * @return {Promise<string>} Возвращает Promise, который в качестве результата вернет идентификатор окна, который потребуется для закрытия этого окна. см метод {@link closePopup}
 * @remark
 * Для обновления уже открытого окна в config нужно передать св-во id с идентификатором открытого окна.
 * @static
 * @example
 * js
 * <pre>
 *    import {Stack} from 'Controls/popup';
 *    ...
 *    openStack() {
 *        Stack.openPopup({
 *          template: 'Example/MyStackTemplate',
 *          opener: this._children.myButton
 *        }).then((popupId) => {
 *          this._popupId = popupId;
 *        });
 *    },
 *
 *    closeStack() {
 *       Stack.closePopup(this._popupId);
 *    }
 * </pre>
 * @see closePopup
 * @see close
 * @see open
 */

/*
 * Open Stack popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 * @function Controls/_popup/interface/IStack#openPopup
 * @param {PopupOptions} config Stack popup options.
 * @return {Promise<string>} Returns id of popup. This id used for closing popup.
 * @static
 * @see closePopup
 */

/**
 * Статический метод для закрытия окна по идентификатору.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/#open-popup Подробнее}.
 * @function Controls/_popup/interface/IStack#closePopup
 * @param {String} popupId Идентификатор окна, который был получен при вызове метода {@link openPopup}.
 * @static
 * @example
 * js
 * <pre>
 *    import {Stack} from 'Controls/popup';
 *    ...
 *    openStack() {
 *        Stack.openPopup({
 *          template: 'Example/MyStackTemplate',
 *          opener: this._children.myButton
 *        }).then((popupId) => {
 *          this._popupId = popupId;
 *        });
 *    },
 *
 *    closeStack() {
 *       Stack.closePopup(this._popupId);
 *    }
 * </pre>
 * @see openPopup
 * @see opener
 * @see close
 */

/*
 * Close Stack popup.
 * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/stack/ See more}.
 * @function Controls/_popup/interface/IStack#closePopup
 * @param {String} popupId Id of popup.
 * @static
 * @see openPopup
 */


/**
 * @name Controls/_popup/interface/IStack#minWidth
 * @cfg {Number} Минимально допустимая ширина стековой панели.
 */

/*
 * @name Controls/_popup/interface/IStack#minWidth
 * @cfg {Number} The minimum width of popup.
 */

/**
 * @name Controls/_popup/interface/IStack#maxWidth
 * @cfg {Number} Максимально допустимая ширина стековой панели.
 */

/*
 * @name Controls/_popup/interface/IStack#maxWidth
 * @cfg {Number} The maximum width of popup.
 */

/**
 * @name Controls/_popup/interface/IStack#width
 * @cfg {Number} Текущая ширина стековой панели.
 */

/*
 * @name Controls/_popup/interface/IStack#width
 * @cfg {Number} Width of popup.
 */

/**
 * @name Controls/_popup/interface/IStack#propStorageId
 * @cfg {String} Уникальный идентификатор контрола, по которому будет сохраняться конфигурация в хранилище данных.
 * С помощью этой опции включается функционал движения границ.
 * Помимо propStorageId необходимо задать опции {@link width}, {@link minWidth}, {@link maxWidth}.
 */

/**
 * @typedef {Object} PopupOptions
 * @description Конфигурация стековой панели.
 * @property {Boolean} [autofocus=true] Определяет, установится ли фокус на шаблон попапа после его открытия.
 * @property {Boolean} [modal=false] Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
 * @property {String} className Имена классов, которые будут применены к корневой ноде всплывающего окна.
 * @property {Boolean} [closeOnOutsideClick=false] Определяет возможность закрытия всплывающего окна по клику вне.
 * @property {function|String} template Шаблон всплывающего окна.
 * @property {function|String} templateOptions Опции для контрола, переданного в {@link template}.
 * @property {Number} minWidth Минимально допустимая ширина всплывающего окна. Значение указывается в px.
 * @property {Number} maxWidth Максимально допустимая ширина всплывающего окна. Значение указывается в px.
 * @property {Number} width Текущая ширина всплывающего окна. Значение указывается в px.
 * @property {Node} opener Логический инициатор открытия всплывающего окна. Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
 * @property {Controls/_popup/interface/IBaseOpener.typedef} eventHandlers Функции обратного вызова на события стековой панели.
 */

/*
 * @typedef {Object} PopupOptions
 * @description Stack popup options.
 * @property {Boolean} [autofocus=true] Determines whether focus is set to the template when popup is opened.
 * @property {Boolean} [modal=false] Determines whether the window is modal.
 * @property {String} className Class names of popup.
 * @property {Boolean} [closeOnOutsideClick=false] Determines whether possibility of closing the popup when clicking past.
 * @property {function|String} template Template inside popup.
 * @property {function|String} templateOptions Template options inside popup.
 * @property {Number} minWidth The minimum width of popup.
 * @property {Number} maxWidth The maximum width of popup.
 * @property {Number} width Width of popup.
 * @property {Node} opener Read more {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener there}.
 * @property {Controls/_popup/interface/IBaseOpener.typedef} eventHandlers Callback functions on popup events.
 */
