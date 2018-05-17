/// <amd-module name="File/ResourceGetter/DropArea" />
/// <amd-dependency path="css!File/ResourceGetter/DropArea" />
define("File/ResourceGetter/DropArea", ["require", "exports", "tslib", "File/ResourceGetter/Base", "Core/Deferred", "Core/helpers/random-helpers", "File/utils/ExtensionsHelper", "File/ResourceGetter/DropArea/replaceDir", "css!File/ResourceGetter/DropArea"], function (require, exports, tslib_1, IResourceGetterBase, Deferred, random, ExtensionsHelper, replaceDir) {
    "use strict";
    var OVERLAY_ID_PREFIX = "DropArea-";
    var OVERLAY_CLASS = 'DropArea_overlay';
    var GLOBAL = (function () { return this || (0, eval)('this'); }());
    var DOC = GLOBAL.document;
    var IS_SUPPORT = DOC && DOC.body;
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
            var area = getArea(target);
            replaceDir(event.dataTransfer).addCallback(function (files) {
                area.handler(files);
            });
            dragEnd();
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
        var containFileType = dataTransfer.types.join(',').toLowerCase().indexOf('files') >= 0;
        return containFileType && !isDrag && !!areaCount;
    };
    // обработчики событий drag&drop на документе
    var globalHandlers = {
        dragenter: function (event) {
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
        dragleave: function (event) {
            // Если покинули область окна браузера, то убираем наши обёртки
            if (!event.relatedTarget) {
                dragEnd();
            }
        },
        drop: function (event) {
            // Если бросили файл в произвольную область - просто убераем наши обёртки
            dragEnd();
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
         * @cfg {Array.<String>} Список расширений выбираемых файлов
         * <wiTag group="Управление">
         * Помимо перечисления массива конкретных расширений файлов, можно также передать в массив значения:
         * <ul>
         *      <li> "image" - доступен выбор всех типов изображений</li>
         *      <li> "audio" - доступен выбор всех типов аудио файлов</li>
         *      <li> "video" - доступен выбор всех типов видео файлов</li>
         * </ul>
         * @example
         * <pre>
         *    extensions: ["image"]
         *    // extensions: ["jpe","jpg","jpeg","gif","png","bmp","ico","svg","svgz","tif","tiff","pct","psd"]
         * </pre>
         * @name File/ResourceGetter/DropArea#extensions
         */
        extensions: null,
        /**
         * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
         * @name File/ResourceGetter/DropArea#element
         */
        element: null,
        /**
         * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
         * @name File/ResourceGetter/DropArea#ondrop
         */
        ondrop: function (files) { },
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов
         * @name File/ResourceGetter/DropArea#dragText
         */
        dragText: rk("Переместите файлы сюда"),
        /**
         * @cfg {String} Текст на внутреннем элементе во время перемещения файлов непосредственно над ним
         * @name File/ResourceGetter/DropArea#dropText
         */
        dropText: rk("Отпустите файлы"),
        /**
         * @cfg {String} Класс внутреннего элемента обёртки, содержащий текст
         * @name File/ResourceGetter/DropArea#innerClass
         */
        innerClass: null
    };
    /**
     * Класс реализующий интерфейс IResourceGetter, позволяющий получать ресурсы через DragAndDrop
     * @class
     * @name File/ResourceGetter/DropArea
     * @extends File/IResourceGetter
     * @public
     * @author Заляев А.В.
     */
    var DropArea = /** @class */ (function (_super) {
        tslib_1.__extends(DropArea, _super);
        function DropArea(cfg) {
            var _this = _super.call(this) || this;
            _this.name = "DropArea";
            _this._options = Object.assign({}, OPTION, cfg);
            if (!_this._options.element) {
                throw new Error('arguments "element" is required');
            }
            _this._extensions = new ExtensionsHelper(_this._options.extensions);
            var _a = _this._options, element = _a.element, innerClass = _a.innerClass, dragText = _a.dragText, dropText = _a.dropText;
            _this._uid = random.createGUID();
            areas[_this._uid] = {
                element: element, innerClass: innerClass, dragText: dragText, dropText: dropText,
                handler: function (files) {
                    var result = _this._extensions.verifyAndReplace(files);
                    _this._options.ondrop.call(_this, result);
                    if (_this._selectDef) {
                        _this._selectDef.callback(result);
                        _this._selectDef = null;
                    }
                }
            };
            areaCount++;
            return _this;
        }
        /**
         * Возвращает Deferred, который стрельнёт, когда на указанный элемент будут перемещены файлы
         * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
         * @method
         * @name File/ResourceGetter/DropArea#getFiles
         * @see File/LocalFile
         */
        DropArea.prototype.getFiles = function () {
            if (this.isDestroyed()) {
                return Deferred.fail("Resource getter is destroyed");
            }
            if (this._selectDef) {
                this._selectDef.cancel();
            }
            return this._selectDef = new Deferred();
        };
        /**
         * Возможен ли выбор файлов
         * @return {Core/Deferred.<Boolean>}
         * @method
         * @name File/ResourceGetter/DropArea#canExec
         */
        DropArea.prototype.canExec = function () {
            return Deferred.success(IS_SUPPORT && !this.isDestroyed());
        };
        DropArea.prototype.destroy = function () {
            if (this._selectDef) {
                this._selectDef.cancel();
            }
            delete areas[this._uid];
            areaCount--;
            _super.prototype.destroy.call(this);
        };
        return DropArea;
    }(IResourceGetterBase));
    return DropArea;
});
