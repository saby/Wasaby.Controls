/* eslint-disable */
define('Controls/interface/IInfoboxOptions', [
], function() {

   /**
    * Конфигурация всплывающей подсказки.
    *
    * @interface Controls/interface/IInfoboxOptions
    * @default {}
    * @public
    * @author Красильников А.С.
    */

   /*
    * Infobox configuration.
    *
    * @interface Controls/interface/IInfoboxOptions
    * @default {}
    * @public
    * @author Красильников А.С.
    */

   /**
    * @typedef {Object} TemplateOptions
    * @description Конфигурация всплывающей подсказки.
    * @property {Object} opener Контрол, инициирующий открытие всплывающей подсказки.
    * @property {String|Function} template Шаблон содержимого всплывающего окна.
    * @property {Object} templateOptions Параметры шаблона содержимого всплывающего окна.
    * @property {Object} eventHandlers Функции обратного вызова на события всплывающего окна.
    * @property {domNode} target Целевой элемент, относильно которого расположено всплывающее окно.
    * @property {String} position Точечное позиционирование целевого элемента относительно всплывающего окна.
    * @property {String} message Текст в теге "body" всплывающего окна.
    * @property {Boolean} float Следует ли отображать крестик закрытия.
    * @property {String} style Стиль отображения всплывающей подсказки.
    * @property {Number} showDelay Задержка перед открытием.
    */

   /*
    * @typedef {Object} TemplateOptions
    * @description Infobox configuration.
    * @property {Object} opener Control, which is the logical initiator of popup opening.
    * @property {String|Function} template Template inside popup
    * @property {Object} templateOptions Template options inside popup.
    * @property {Object} eventHandlers Callback functions on popup events
    * @property {domNode} target The target relative to which the popup is positioned.
    * @property {String} position Point positioning of the target relative to infobox.
    * @property {String} message The text in the body popup.
    * @property {Boolean} float Whether the content should wrap around the cross closure.
    * @property {String} style Infobox display style.
    * @property {Number} showDelay Delay before opening.
    */

   /**
    * @name Controls/interface/IInfoboxOptions#templateOptions
    * @cfg {TemplateOptions[]} Параметры шаблона содержимого всплывающего окна.
    */

   /*
    * @name Controls/interface/IInfoboxOptions#templateOptions
    * @cfg {TemplateOptions[]} Template options inside popup.
    */

   /**
    * @typedef {Object} EventHandlers
    * @description Функции обратного вызова на события всплывающего окна.
    * @property {Function} onClose Функция обратного вызова, которая вызывается при закрытии всплывающего окна.
    * @property {Function} onResult Функция обратного вызова, которая вызывается в событии sendResult в шаблоне всплывающего окна.
    */

   /*
    * @typedef {Object} EventHandlers
    * @description Callback functions on popup events.
    * @property {Function} onClose Callback function is called when popup is closed.
    * @property {Function} onResult Callback function is called at the sendResult event in the popup template.
    */

   /**
    * @name Controls/interface/IInfoboxOptions#eventHandlers
    * @cfg {EventHandlers[]} Функции обратного вызова на события всплывающего окна.
    * @default {}
    * @remark
    * Необходимо учитывать контекст выполнения функций обратного вызова.
    * @example
    * userControl.wml
    * <pre>
    *     <Controls.popup:Stack name="stack">
    *         <ws:popupOptions template="Controls-demo/Popup/TestStack" modal="{{true}}" autofocus="{{false}}">
    *            <ws:templateOptions key="111"/>
    *            <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
    *         </ws:popupOptions>
    *      </Controls.popup:Stack>
    *
    *      <Controls.breadcrumbs:Path name="openStackButton" caption="open stack" on:click="_openStack()"/>
    * </pre>
    * userControl.js
    * <pre>
    *   Control.extend({
    *      ...
    *
    *      constructor: function() {
    *         Control.superclass.constructor.apply(this, arguments);
    *         this._onResultHandler = this._onResultHandler.bind(this);
    *         this._onCloseHandler= this._onCloseHandler.bind(this);
    *      }
    *
    *      _openStack() {
    *         var popupOptions = {
    *             autofocus: true,
    *             templateOptions: {
    *               record: this._record
    *             }
    *         }
    *         this._children.stack.open(popupOptions)
    *      }
    *
    *      _onResultHandler(newData) {
    *         this._data = newData;
    *      }
    *
    *      _onCloseHandler() {
    *         this._sendData(this._data);
    *      }
    *      ...
    *  });
    * </pre>
    * TestStack.wml
    * <pre>
    *     ...
    *     <Controls.breadcrumbs:Path name="sendDataButton" caption="sendData" on:click="_sendData()"/>
    *     ...
    * </pre>
    * TestStack.js
    * <pre>
    *     Control.extend({
    *         ...
    *
    *         _sendData() {
    *            var data = {
    *               record: this._record,
    *               isNewRecord: true
    *            }
    *
    *            // send data to userControl.js
    *            this._notify('sendResult', [data], {bubbling: true});
    *
    *            // close popup
    *            this._notify('close', [], {bubbling: true});
    *         }
    *         ...
    *     );
    * </pre>
    */

   /*
    * @name Controls/interface/IInfoboxOptions#eventHandlers
    * @cfg {EventHandlers[]} Callback functions on popup events.
    * @variant onClose Callback function is called when popup is closed.
    * @default {}
    * @remark
    * You need to consider the context of callback functions execution. see examples.
    * @example
    * userControl.wml
    * <pre>
    *     <Controls.popup:Stack name="stack">
    *         <ws:popupOptions template="Controls-demo/Popup/TestStack" modal="{{true}}" autofocus="{{false}}">
    *            <ws:templateOptions key="111"/>
    *            <ws:eventHandlers onResult="{{_onResultHandler}}" onClose="{{_onCloseHandler}}" />
    *         </ws:popupOptions>
    *      </Controls.popup:Stack>
    *
    *      <Controls.breadcrumbs:Path name="openStackButton" caption="open stack" on:click="_openStack()"/>
    * </pre>
    * userControl.js
    * <pre>
    *   Control.extend({
    *      ...
    *
    *      constructor: function() {
    *         Control.superclass.constructor.apply(this, arguments);
    *         this._onResultHandler = this._onResultHandler.bind(this);
    *         this._onCloseHandler= this._onCloseHandler.bind(this);
    *      }
    *
    *      _openStack() {
    *         var popupOptions = {
    *             autofocus: true,
    *             templateOptions: {
    *               record: this._record
    *             }
    *         }
    *         this._children.stack.open(popupOptions)
    *      }
    *
    *      _onResultHandler(newData) {
    *         this._data = newData;
    *      }
    *
    *      _onCloseHandler() {
    *         this._sendData(this._data);
    *      }
    *      ...
    *  });
    * </pre>
    * TestStack.wml
    * <pre>
    *     ...
    *     <Controls.breadcrumbs:Path name="sendDataButton" caption="sendData" on:click="_sendData()"/>
    *     ...
    * </pre>
    * TestStack.js
    * <pre>
    *     Control.extend({
    *         ...
    *
    *         _sendData() {
    *            var data = {
    *               record: this._record,
    *               isNewRecord: true
    *            }
    *
    *            // send data to userControl.js
    *            this._notify('sendResult', [data], {bubbling: true});
    *
    *            // close popup
    *            this._notify('close', [], {bubbling: true});
    *         }
    *         ...
    *     );
    * </pre>
    */

});
