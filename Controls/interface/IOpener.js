/* eslint-disable */
define('Controls/interface/IOpener', [], function() {

   /**
    * Интерфейс контрола-опенера.
    *
    * @interface Controls/interface/IOpener
    * @public
    * @author Красильников А.С.
    */

   /*
    * Interface for opener.
    *
    * @interface Controls/interface/IOpener
    * @public
    * @author Красильников А.С.
    */

   /**
    * @name Controls/interface/IOpener#isOpened
    * @description Возвращает информацию о том, открыто ли всплывающее окно.
    * @function
    */

   /*
    * @name Controls/interface/IOpener#isOpened
    * @description Popup opened status.
    * @function
    */


   /**
    * Открывает всплывающее окно.
    * @function Controls/Popup/Opener/Base#open
    * @param popupOptions Конфигурация всплывающего окна
    * @param controller Контрол-контроллер для всплывающего окна.
    */

   /*
    * Opens a popup
    * @function Controls/Popup/Opener/Base#open
    * @param popupOptions Popup configuration
    * @param controller Popup Controller
    */

   /**
    * @name Controls/interface/IOpener#autofocus
    * @cfg {Boolean} Определяет, установится ли фокус на шаблон попапа после его открытия.
    * @default true
    */

   /*
    * @name Controls/interface/IOpener#autofocus
    * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
    * @default true
    */

   /**
    * @name Controls/interface/IOpener#modal
    * @cfg {Boolean} Определяет, будет ли открываемое окно блокировать работу пользователя с родительским приложением.
    * @default false
    */

   /*
    * @name Controls/interface/IOpener#modal
    * @cfg {Boolean} Determines whether the window is modal.
    * @default false
    */

   /**
    * @name Controls/interface/IOpener#className
    * @cfg {String} Имена классов, которые будут применены к корневой ноде всплывающего окна.
    */

   /*
    * @name Controls/interface/IOpener#className
    * @cfg {String} Class names of popup.
    */

   /**
    * @name Controls/interface/IOpener#closeOnOutsideClick
    * @cfg {Boolean} Определяет возможность закрытия всплывающего окна по клику вне.
    * @default false
    */

   /*
    * @name Controls/interface/IOpener#closeOnOutsideClick
    * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
    * @default false
    */

   /**
    * @name Controls/interface/IOpener#template
    * @cfg {String|Function} Шаблон всплывающего окна
    */

   /*
    * @name Controls/interface/IOpener#template
    * @cfg {String|Function} Template inside popup.
    */

   /**
    * @name Controls/interface/IOpener#templateOptions
    * @cfg {String|Function} Опции для контрола, переданного в {@link template}
    */

   /*
    * @name Controls/interface/IOpener#templateOptions
    * @cfg {String|Function} Template options inside popup.
    */

   /**
    * @name Controls/interface/IOpener#opener
    * @cfg {Node} Логический инициатор открытия всплывающего окна. Читайте подробнее {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/ui-library/focus/index/#control-opener здесь}.
    */


   /**
    * @event Controls/interface/IOpener#close Происходит при закрытии всплывающего окна
    * @example
    * В этом примере мы подписываемся на событие 'close' и в его обработчике удаляем элемент из списка.
    * <pre>
    *    <Controls.popup:Stack on:close="_popupCloseHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupCloseHandler() {
    *          this._removeItem(this._currentItem);
    *       }
    *       ...
    *    });
    * </pre>
    */

   /*
    * @event Controls/interface/IOpener#close Occurs when popup is closed.
    * @example
    * In this example, we subscribe to close event and remove item at list
    * <pre>
    *    <Controls.popup:Stack on:close="_popupCloseHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupCloseHandler() {
    *          this._removeItem(this._currentItem);
    *       }
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/interface/IOpener#result Происходит, когда дочерний контрол всплывающего окна инициирует событие 'sendResult'
    * @example
    * В этом примере мы подписываемся на событие 'result' и в его обработчике сохраняем данные с шаблона.
    * <pre>
    *    // MainControl.wml
    *    <Controls.popup:Stack on:result="_popupResultHandler()" />
    * </pre>
    *
    * <pre>
    *    // MainControl.js
    *    Control.extend({
    *       ...
    *       _popupResultHandler(event, userData) {
    *          this._saveUserData(userData);
    *       }
    *       ...
    *    });
    * </pre>
    *
    * <pre>
    *    // popupTemplate.js
    *    Control.extend({
    *       ...
    *       _sendDataToMainControl(userData) {
    *          this._notify('sendResult', [userData], { bubbling: true});
    *       }
    *       ...
    *    });
    * </pre>
    */

   /*
    * @event Controls/interface/IOpener#result Occurs when child control of popup notify "sendResult" event.
    * @example
    * In this example, we subscribe to result event and save user data.
    * <pre>
    *    // MainControl.wml
    *    <Controls.popup:Stack on:result="_popupResultHandler()" />
    * </pre>
    *
    * <pre>
    *    // MainControl.js
    *    Control.extend({
    *       ...
    *       _popupResultHandler(event, userData) {
    *          this._saveUserData(userData);
    *       }
    *       ...
    *    });
    * </pre>
    *
    * <pre>
    *    // popupTemplate.js
    *    Control.extend({
    *       ...
    *       _sendDataToMainControl(userData) {
    *          this._notify('sendResult', [userData], { bubbling: true});
    *       }
    *       ...
    *    });
    * </pre>
    */

   /**
    * @event Controls/interface/IOpener#open Происходит при открытии всплывающего окна
    * @example
    * В этом примере мы подписываемся на событие 'open' и в его обработчике меняем состояние '_popupOpened'
    * <pre>
    *    <Controls.popup:Stack on:open="_popupOpenHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupOpenHandler() {
    *          this._popupOpened = true;
    *          this._changeStatus(this._popupOpened);
    *       }
    *       ...
    *    });
    * </pre>
    */

   /*
    * @event Controls/interface/IOpener#open Occurs when popup is opened.
    * @example
    * In this example, we subscribe to open event and change text at input control
    * <pre>
    *    <Controls.popup:Stack on:open="_popupOpenHandler()" />
    * </pre>
    *
    * <pre>
    *    Control.extend({
    *       ...
    *       _popupOpenHandler() {
    *          this._popupOpened = true;
    *          this._changeStatus(this._popupOpened);
    *       }
    *       ...
    *    });
    * </pre>
    */

   /**
    * @typedef {Object} EventHandlers
    * @description Функции обратного вызова позволяют подписаться на события всплывающего окна, открытого через статические методы.
    * Когда {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/ открывающий контрол} добавлен в шаблон, можно задать декларативную подписку на события.
    * @property {Function} onOpen Функция обратного вызова, которая вызывается при открытии всплывающего окна.
    * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-open-window здесь}.
    * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
    * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-close-window здесь}.
    * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
    * Пример декларативной подписки на событие доступен {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/openers/#event-result здесь}.
    */
});
