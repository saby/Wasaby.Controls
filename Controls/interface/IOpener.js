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
    * @description Признак открытости окна.
    * @function
    */

   /*
    * @name Controls/interface/IOpener#isOpened
    * @description Popup opened status.
    * @function
    */

   /**
    * Открыть всплывающую панель.
    * @function Controls/Popup/Opener/Base#open
    * @param popupOptions Параметры всплывающего окна.
    * @param controller Контроллер всплывающего окна.
    */

   /*
    * Opens a popup
    * @function Controls/Popup/Opener/Base#open
    * @param popupOptions Popup configuration
    * @param controller Popup Controller
    */

   /**
    * @name Controls/interface/IOpener#autofocus
    * @cfg {Boolean} Определяет, установлен ли фокус на шаблон при открытии всплывающего окна.
    * @default true
    */

   /*
    * @name Controls/interface/IOpener#autofocus
    * @cfg {Boolean} Determines whether focus is set to the template when popup is opened.
    * @default true
    */

   /**
    * @name Controls/interface/IOpener#modal
    * @cfg {Boolean} Определяет, является ли окно модальным.
    * @default false
    */

   /*
    * @name Controls/interface/IOpener#modal
    * @cfg {Boolean} Determines whether the window is modal.
    * @default false
    */

   /**
    * @name Controls/interface/IOpener#className
    * @cfg {String} Имена классов всплывающих окон.
    */

   /*
    * @name Controls/interface/IOpener#className
    * @cfg {String} Class names of popup.
    */

   /**
    * @name Controls/interface/IOpener#closeOnOutsideClick
    * @cfg {Boolean} Определяет, возможно ли закрыть всплывающее окно кликом за его пределами.
    * @default false
    */

   /*
    * @name Controls/interface/IOpener#closeOnOutsideClick
    * @cfg {Boolean} Determines whether possibility of closing the popup when clicking past.
    * @default false
    */

   /**
    * @name Controls/interface/IOpener#template
    * @cfg {String|Function} Шаблон содержимого всплывающего окна.
    */

   /*
    * @name Controls/interface/IOpener#template
    * @cfg {String|Function} Template inside popup.
    */

   /**
    * @name Controls/interface/IOpener#templateOptions
    * @cfg {String|Function} Параметры шаблона содержимого всплывающего окна.
    */

   /*
    * @name Controls/interface/IOpener#templateOptions
    * @cfg {String|Function} Template options inside popup.
    */

   /**
    * @event Controls/interface/IOpener#close Происходит при закрытии всплывающего окна.
    * @example
    * В этом примере мы подписываемся на событие закрытия окна и удаления элемента из списка.
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
    * @event Controls/interface/IOpener#result Происходит, когда у дочернего контрола нотификационного окна срабатывает событие "sendResult".
    * @example
    * В этом примере мы подписываемся на событие "result" и сохраняем пользовательские данные.
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
    * @event Controls/interface/IOpener#open Происходит при открытии всплывающего окна.
    * @example
    * В этом примере мы подписываемся на событие "open" и изменяем вводимый текст.
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
});
