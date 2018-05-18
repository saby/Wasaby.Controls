/// <amd-module name="File/ResourceGetter/DropArea" />
/// <amd-dependency path="css!File/ResourceGetter/DropArea" />

import IResourceGetterBase = require("File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import LocalFile = require("File/LocalFile");
import random = require("Core/helpers/random-helpers");
import ExtensionsHelper = require("File/utils/ExtensionsHelper");
import replaceDir = require("File/ResourceGetter/DropArea/replaceDir");

type Handler = (files: FileList) => void;
/**
 * @typedef {Function} Handler
 * @param {Array.<File>} files
 * @void
 */

type Area = {
    element: HTMLElement;
    handler: Handler;
    dragText: string;
    dropText: string;
    innerClass?: string;
}
/**
 * @typedef {Object} Area
 * @property {HTMLElement} element
 * @property {Handler} handler
 * @property {String} [text]
 */

type Areas = {
    [propName: string]: Area;
}

// Чтобы ts не ругался, что у DragEvent(MouseEvent) поля target и relatedTarget это EventTarget, а не HTMLElement
type HTMLDragEvent = DragEvent & {
    target: HTMLElement;
    relatedTarget: HTMLElement;
}

const OVERLAY_ID_PREFIX = "DropArea-";
const OVERLAY_CLASS = 'DropArea_overlay';
const GLOBAL = (function(){ return this || (0,eval)('this'); }());
const DOC = GLOBAL.document;
const IS_SUPPORT = DOC && DOC.body;

let areas: Areas = Object.create(null);
let areaCount = 0;
let dropAreas = [];

/**
 * Возвращает значение свойства z-index у элемента
 * @param element
 * @return {Number}
 */
let getZIndex = (element) => {
    if (!element || element === DOC) {
        return 0;
    }
    let index = parseInt(DOC.defaultView.getComputedStyle(element).getPropertyValue('z-index'));
    if (isNaN(index)) { return getZIndex(element.parentNode) }
    return index;
};

/**
 * Устанавливает позицию перекрывающего элемента над указанным
 * @param overlay
 * @param element
 */
let setOverlayPosition = (overlay, element) => {
    overlay.setAttribute('style', `
        top: ${element.offsetTop}px;
        left: ${element.offsetLeft}px;
        width: ${element.offsetWidth}px;
        height: ${element.offsetHeight}px;
        z-index: ${getZIndex(element) + 1};
    `);
};
// Создаёт обёртку над указанным элементом
let createOverlay = (area: Area, uid: string) => {
    let overlay = DOC.createElement("div");
    let element = area.element;
    overlay.classList.add(OVERLAY_CLASS);
    overlay.setAttribute('id', `${OVERLAY_ID_PREFIX}${uid}`);
    setOverlayPosition(overlay, element);
    let inner = DOC.createElement("div");
    if (area.innerClass) {
        inner.classList.add(area.innerClass || "");
    }
    inner.innerText = area.dragText;
    overlay.appendChild(inner);
    element.parentNode.insertBefore(overlay, element);
    return overlay;
};
let getArea = (element: HTMLElement) => {
    let uid = element.getAttribute("id").replace(OVERLAY_ID_PREFIX, "");
    return areas[uid];
};

/**
 * Зафиксировано ли перемещения файла над окном.
 * Необходим для того чтобы не рисовать повторно перекрывающие области для перемещения в них файлов
 * @type {Boolean}
 */
let isDrag: boolean;

// Удаление обёрточных элементов
let dragEnd = () => {
    isDrag = false;
    dropAreas.forEach((overlay) => {
        overlay.parentNode.removeChild(overlay);
    });
    dropAreas = [];
};

/// region event handlers
// обработчики событий drag&drop на обёртке
let overlayHandlers = {
    dragenter(event: HTMLDragEvent) {
        if (dropAreas.indexOf(event.target) === -1) {
            return
        }
        event.target.querySelector('div').innerText = getArea(event.target).dropText;
    },
    dragover(event: HTMLDragEvent) {
        // без этого нормально не убьётся стандартный обработчик drop
        event.preventDefault();
    },
    dragleave(event: HTMLDragEvent) {
        // игнорируем перемещение на внутренний элемент и обратно
        if (
            event.relatedTarget && (event.relatedTarget.parentNode == this) ||
            (dropAreas.indexOf(event.relatedTarget) !== -1)
        ) {
            return
        }
        let target = dropAreas.indexOf(event.target) === -1? <HTMLElement> event.target.parentNode: event.target;
        target.querySelector('div').innerText = getArea(target).dragText;
    },
    drop(event: HTMLDragEvent) {
        event.preventDefault();
        event.stopPropagation();
        let target = dropAreas.indexOf(event.target) === -1? <HTMLElement> event.target.parentNode: event.target;
        let area = getArea(target);
        replaceDir(event.dataTransfer).addCallback((files) => {
            area.handler(files);
        });
        dragEnd();
    }
};
let isNeedOverlay = (dataTransfer: DataTransfer): boolean => {
    /**
     * В большенстве браузеров при переносе файлов dataTransfer.types == ['Files']
     * И хватает только проверки первого элемента, но некоторые браузеры в зависимости от версии добавляют свои типы
     * например ["application/x-moz-file", "Files"]
     *
     * Ещё может расходиться регистр => Array.prototype.include не совсем подходит
     * Поэтому самое простое это склеить типы в строку, привести к единому регистру и найти вхождение
     */
    let containFileType = Array.prototype.join.call(dataTransfer.types, ',').toLowerCase().indexOf('files') >= 0;
    return containFileType && !isDrag && !!areaCount
};
// обработчики событий drag&drop на документе
let globalHandlers = {
    dragenter(event: HTMLDragEvent) {
        // Если обёртки готовы для всех элементов или событие не содержит файлы, то выходим
        if (!isNeedOverlay(event.dataTransfer)) {
            return
        }
        // иначе создаём обёртки и вешаем обработчики
        isDrag = true;
        for (let uid in areas) {
            let overlay = createOverlay(areas[uid], uid);
            dropAreas.push(overlay);
            for (let event in overlayHandlers) {
                overlay.addEventListener(event, overlayHandlers[event]);
            }
        }
    },
    dragleave(event: HTMLDragEvent) {
        // Если покинули область окна браузера, то убираем наши обёртки
        if (!event.relatedTarget) {
            dragEnd();
        }
    },
    drop(event: HTMLDragEvent) {
        // Если бросили файл в произвольную область - просто убераем наши обёртки
        dragEnd();
    }
};
/// endregion event handlers

if (IS_SUPPORT) {
    for (let event in globalHandlers) {
        DOC.addEventListener(event, globalHandlers[event]);
    }
}

const OPTION = {
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
    ondrop: (files: Array<LocalFile>) => {},
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
class DropArea extends IResourceGetterBase {
    protected name = "DropArea";
    protected _options;
    private _selectDef: Deferred<Array<LocalFile>>;
    private _uid: string;
    private _extensions: ExtensionsHelper;
    constructor(cfg) {
        super();
        this._options = Object.assign({}, OPTION, cfg);
        if (!this._options.element) {
            throw new Error('arguments "element" is required');
        }
        this._extensions = new ExtensionsHelper(this._options.extensions);
        let {element, innerClass, dragText, dropText} = this._options;
        this._uid = random.createGUID();
        areas[this._uid] = {
            element, innerClass, dragText, dropText,
            handler: (files: FileList) => {
                let result = this._extensions.verifyAndReplace(files);
                this._options.ondrop.call(this, result);
                if (this._selectDef) {
                    this._selectDef.callback(result);
                    this._selectDef = null;
                }
            }
        };
        areaCount++;
    }
    /**
     * Возвращает Deferred, который стрельнёт, когда на указанный элемент будут перемещены файлы
     * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
     * @method
     * @name File/ResourceGetter/DropArea#getFiles
     * @see File/LocalFile
     */
    getFiles(): Deferred<Array<LocalFile | Error>> {
        if (this.isDestroyed()) {
            return Deferred.fail("Resource getter is destroyed");
        }
        if (this._selectDef) {
            this._selectDef.cancel();
        }
        return this._selectDef = new Deferred();
    }
    /**
     * Возможен ли выбор файлов
     * @return {Core/Deferred.<Boolean>}
     * @method
     * @name File/ResourceGetter/DropArea#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(IS_SUPPORT && !this.isDestroyed());
    }
    destroy() {
        if (this._selectDef) {
            this._selectDef.cancel();
        }
        delete areas[this._uid];
        areaCount--;
        super.destroy();
    }
}

export = DropArea;
