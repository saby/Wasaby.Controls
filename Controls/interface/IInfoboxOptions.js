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


});
