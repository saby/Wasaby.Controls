/// <amd-module name="File/ResourceGetter/DropArea/Overlay" />
/// <amd-dependency path="css!File/ResourceGetter/DropArea/Overlay" />
import createGUID = require("Core/helpers/createGUID");

type OnDropHandler = (data: DataTransfer) => void;
/**
 * @typedef {Function} OnDropHandler
 * @param {Array.<File>} files
 * @void
 */

export type OverlayViewConfig = {
    dragText: string;
    dropText: string;
    dragSubtitle: string;
    dropSubtitle: string;
    innerClass: string;
}
export type OverlayConfig = Partial<OverlayViewConfig> & {
    element: HTMLElement;
    ondrop: OnDropHandler;
}
/**
 * @typedef {Object} OverlayConfig
 * @property {HTMLElement} element
 * @property {OnDropHandler} handler
 * @property {String} [text]
 */

type OverlayAreas = {
    [propName: string]: OverlayConfig;
}

// Чтобы ts не ругался, что у DragEvent(MouseEvent) поля target и relatedTarget это EventTarget, а не HTMLElement
type HTMLDragEvent = DragEvent & {
    target: HTMLElement;
    relatedTarget: HTMLElement;
}

const OVERLAY_ID_PREFIX = "DropArea-";
const OVERLAY_CLASS = 'DropArea_overlay';
const TITLE_CLASS = "title";
const SUBTITLE_CLASS = "subtitle";
const SIZE_CLASS_POSTFIX = "_size_";
const GLOBAL = (function(){ return this || (0,eval)('this'); }());
const DOC = GLOBAL.document;
const IS_SUPPORT = DOC && DOC.body;
const DRAG_END_TIMEOUT = 200;

let areas: OverlayAreas = Object.create(null);
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
    let sizes = [190, 280, 340, 400, 510];
    for (let i = 0; i < sizes.length; i++) {
        let width = sizes[i];
        if (element.offsetWidth < width) {
            element.classList.add(`${OVERLAY_CLASS}${SIZE_CLASS_POSTFIX}${i+1}`);
            break;
        }
    }
};
// Создаёт обёртку над указанным элементом
let createOverlay = (area: OverlayConfig, uid: string) => {
    let overlay = DOC.createElement("div");
    let element = area.element;
    overlay.classList.add(OVERLAY_CLASS, area.innerClass);
    overlay.setAttribute('id', `${OVERLAY_ID_PREFIX}${uid}`);
    setOverlayPosition(overlay, element);

    // title
    let title = DOC.createElement("div");
    title.classList.add(TITLE_CLASS);
    title.innerText = area.dragText;
    overlay.appendChild(title);

    // subtitle
    let dragSubtitle = DOC.createElement("div");
    dragSubtitle.classList.add(SUBTITLE_CLASS);
    dragSubtitle.innerText = area.dragSubtitle;
    overlay.appendChild(dragSubtitle);

    element.parentNode.insertBefore(overlay, element);
    return overlay;
};
let getArea = (element: HTMLElement) => {
    let uid = element.getAttribute("id").replace(OVERLAY_ID_PREFIX, "");
    return areas[uid];
};
let updateOverlayText = (target: HTMLElement, isDragOver: boolean) => {
    let area = getArea(target);
    let title = <HTMLElement> target.querySelector('.' + TITLE_CLASS);
    let subtitle = <HTMLElement> target.querySelector('.' + SUBTITLE_CLASS);
    if (isDragOver) {
        title.innerText = area.dropText;
        subtitle.innerText = area.dropSubtitle;
        return
    }
    title.innerText = area.dragText;
    subtitle.innerText = area.dragSubtitle;
};

/**
 * Зафиксировано ли перемещения файла над окном.
 * Необходим для того чтобы не рисовать повторно перекрывающие области для перемещения в них файлов
 * @type {Boolean}
 */
let isDrag: boolean;
/**
 * Таймер удаления обёрток
 * @type {Number}
 */
let dragEndTimeout: number;

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
        updateOverlayText(event.target, true);
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
        let target = dropAreas.indexOf(event.target) === -1?
            <HTMLElement> event.target.parentNode:
            event.target;
        updateOverlayText(target, false);
    },
    drop(event: HTMLDragEvent) {
        event.preventDefault();
        event.stopPropagation();
        let target = dropAreas.indexOf(event.target) === -1?
            <HTMLElement> event.target.parentNode:
            event.target;
        dragEnd();
        let area = getArea(target);
        area.ondrop(event.dataTransfer);
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
        clearTimeout(dragEndTimeout);
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
    dragleave(/*event: HTMLDragEvent*/) {
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
    drop(/*event: HTMLDragEvent*/) {
        // Если бросили файл в произвольную область - просто убераем наши обёртки
        dragEnd();
    },
    dragover(/*event: HTMLDragEvent*/) {
        clearTimeout(dragEndTimeout);
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
     * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
     * @name File/ResourceGetter/DropArea/Overlay#element
     */
    /**
     * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
     * @name File/ResourceGetter/DropArea/Overlay#ondrop
     */
    ondrop: (data: DataTransfer) => {},
    /**
     * @cfg {String} Текст подсказки во время перемещения файлов
     * @name File/ResourceGetter/DropArea/Overlay#dragText
     */
    dragText: rk('Переместите файлы сюда'),
    /**
     * @cfg {String} Текст подсказки во время перемещения файлов непосредственно над областью
     * @name File/ResourceGetter/DropArea/Overlay#dropText
     */
    dropText: rk('Отпустите файлы'),
    /**
     * @cfg {String} Текст дополнительной подсказки во время перемещения файлов
     * @name File/ResourceGetter/DropArea/Overlay#dragSubtitle
     */
    dragSubtitle: '',
    /**
     * @cfg {String} Текст дополнительной подсказки во время перемещения файлов непосредственно над областью
     * @name File/ResourceGetter/DropArea/Overlay#dropSubtitle
     */
    dropSubtitle: ''
    /**
     * @cfg {String} Дополнительный класс элемента обёртки
     * @name File/ResourceGetter/DropArea/Overlay#innerClass
     */
};

export class Overlay {
    private readonly __uid: string;
    constructor(cfg: OverlayConfig) {
        this.__uid = createGUID();
        let config = Object.assign({}, OPTION, cfg);
        if (!(config.element instanceof HTMLElement)) {
            throw new Error('argument "element" must be extended of HTMLElement');
        }
        areas[this.__uid] = config;
        areaCount++;
    }
    destroy() {
        areaCount--;
        delete areas[this.__uid];
    }
}
