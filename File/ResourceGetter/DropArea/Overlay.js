/// <amd-module name="File/ResourceGetter/DropArea/Overlay" />
/// <amd-dependency path="css!File/ResourceGetter/DropArea/Overlay" />
define("File/ResourceGetter/DropArea/Overlay", ["require", "exports", "Core/helpers/createGUID", "css!File/ResourceGetter/DropArea/Overlay"], function (require, exports, createGUID) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OVERLAY_ID_PREFIX = "DropArea-";
    var OVERLAY_CLASS = 'DropArea_overlay';
    var GLOBAL = (function () { return this || (0, eval)('this'); }());
    var DOC = GLOBAL.document;
    var IS_SUPPORT = DOC && DOC.body;
    var DRAG_END_TIMEOUT = 200;
    var areas = Object.create(null);
    var areaCount = 0;
    var dropAreas = [];
    /**
     * Возвращает значение свойства z-index у элемента
     * @param element
     * @return {Number}
     */
    var getZIndex = function (element) {
        if (!element || element === DOC) {
            return 0;
        }
        var index = parseInt(DOC.defaultView.getComputedStyle(element).getPropertyValue('z-index'));
        if (isNaN(index)) {
            return getZIndex(element.parentNode);
        }
        return index;
    };
    /**
     * Устанавливает позицию перекрывающего элемента над указанным
     * @param overlay
     * @param element
     */
    var setOverlayPosition = function (overlay, element) {
        overlay.setAttribute('style', "\n        top: " + element.offsetTop + "px;\n        left: " + element.offsetLeft + "px;\n        width: " + element.offsetWidth + "px;\n        height: " + element.offsetHeight + "px;\n        z-index: " + (getZIndex(element) + 1) + ";\n    ");
    };
    // Создаёт обёртку над указанным элементом
    var createOverlay = function (area, uid) {
        var overlay = DOC.createElement("div");
        var element = area.element;
        overlay.classList.add(OVERLAY_CLASS);
        overlay.setAttribute('id', "" + OVERLAY_ID_PREFIX + uid);
        setOverlayPosition(overlay, element);
        var inner = DOC.createElement("div");
        if (area.innerClass) {
            inner.classList.add(area.innerClass || "");
        }
        inner.innerText = area.dragText;
        overlay.appendChild(inner);
        element.parentNode.insertBefore(overlay, element);
        return overlay;
    };
    var getArea = function (element) {
        var uid = element.getAttribute("id").replace(OVERLAY_ID_PREFIX, "");
        return areas[uid];
    };
    /**
     * Зафиксировано ли перемещения файла над окном.
     * Необходим для того чтобы не рисовать повторно перекрывающие области для перемещения в них файлов
     * @type {Boolean}
     */
    var isDrag;
    /**
     * Таймер удаления обёрток
     * @type {Number}
     */
    var dragEndTimeout;
    // Удаление обёрточных элементов
    var dragEnd = function () {
        isDrag = false;
        dropAreas.forEach(function (overlay) {
            overlay.parentNode.removeChild(overlay);
        });
        dropAreas = [];
    };
    /// region event handlers
    // обработчики событий drag&drop на обёртке
    var overlayHandlers = {
        dragenter: function (event) {
            if (dropAreas.indexOf(event.target) === -1) {
                return;
            }
            event.target.querySelector('div').innerText = getArea(event.target).dropText;
        },
        dragover: function (event) {
            // без этого нормально не убьётся стандартный обработчик drop
            event.preventDefault();
        },
        dragleave: function (event) {
            // игнорируем перемещение на внутренний элемент и обратно
            if (event.relatedTarget && (event.relatedTarget.parentNode == this) ||
                (dropAreas.indexOf(event.relatedTarget) !== -1)) {
                return;
            }
            var target = dropAreas.indexOf(event.target) === -1 ? event.target.parentNode : event.target;
            target.querySelector('div').innerText = getArea(target).dragText;
        },
        drop: function (event) {
            event.preventDefault();
            event.stopPropagation();
            var target = dropAreas.indexOf(event.target) === -1 ? event.target.parentNode : event.target;
            dragEnd();
            var area = getArea(target);
            area.ondrop(event.dataTransfer);
        }
    };
    var isNeedOverlay = function (dataTransfer) {
        /**
         * В большенстве браузеров при переносе файлов dataTransfer.types == ['Files']
         * И хватает только проверки первого элемента, но некоторые браузеры в зависимости от версии добавляют свои типы
         * например ["application/x-moz-file", "Files"]
         *
         * Ещё может расходиться регистр => Array.prototype.include не совсем подходит
         * Поэтому самое простое это склеить типы в строку, привести к единому регистру и найти вхождение
         */
        var containFileType = Array.prototype.join.call(dataTransfer.types, ',').toLowerCase().indexOf('files') >= 0;
        return containFileType && !isDrag && !!areaCount;
    };
    // обработчики событий drag&drop на документе
    var globalHandlers = {
        dragenter: function (event) {
            clearTimeout(dragEndTimeout);
            // Если обёртки готовы для всех элементов или событие не содержит файлы, то выходим
            if (!isNeedOverlay(event.dataTransfer)) {
                return;
            }
            // иначе создаём обёртки и вешаем обработчики
            isDrag = true;
            for (var uid in areas) {
                var overlay = createOverlay(areas[uid], uid);
                dropAreas.push(overlay);
                for (var event_1 in overlayHandlers) {
                    overlay.addEventListener(event_1, overlayHandlers[event_1]);
                }
            }
        },
        dragleave: function () {
            /**
             * Под win-10 в IE/Edge в event.relatedTarget постоянно лежит null
             * Хоть и поддержка свойства как бы есть
             * Что не даёт по его отсуствию понять что D&D вышел за пределы окна браузера,
             * или же на другой элемент, чтобы скрыть области обёртки
             *
             * Поэтому при покидании области создаём таймаут по которому удалим их
             * Или же скидываем его если сдектектим dragenter, либо dragover
             */
            dragEndTimeout = setTimeout(dragEnd, DRAG_END_TIMEOUT);
        },
        drop: function () {
            // Если бросили файл в произвольную область - просто убераем наши обёртки
            dragEnd();
        },
        dragover: function () {
            clearTimeout(dragEndTimeout);
        }
    };
    /// endregion event handlers
    if (IS_SUPPORT) {
        for (var event_2 in globalHandlers) {
            DOC.addEventListener(event_2, globalHandlers[event_2]);
        }
    }
    var OPTION = {
        /**
         * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
         * @name File/ResourceGetter/DropArea#element
         */
        /**
         * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
         * @name File/ResourceGetter/DropArea#ondrop
         */
        ondrop: function (data) { },
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов
         * @name File/ResourceGetter/DropArea#dragText
         */
        dragText: rk("Переместите файлы сюда"),
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов непосредственно над ним
         * @name File/ResourceGetter/DropArea#dropText
         */
        dropText: rk("Отпустите файлы")
        /**
         * @cfg {String} Класс внутреннего элемента обёртки, содержащий текст
         * @name File/ResourceGetter/DropArea#innerClass
         */
    };
    var Overlay = /** @class */ (function () {
        function Overlay(cfg) {
            this.__uid = createGUID();
            var config = Object.assign({}, OPTION, cfg);
            if (!(config.element instanceof HTMLElement)) {
                throw new Error('argument "element" must be extended of HTMLElement');
            }
            areas[this.__uid] = config;
            areaCount++;
        }
        Overlay.prototype.destroy = function () {
            areaCount--;
            delete areas[this.__uid];
        };
        return Overlay;
    }());
    exports.Overlay = Overlay;
});
