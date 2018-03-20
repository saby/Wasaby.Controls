/// <amd-module name="File/ResourceGetter/FS" />

import IResourceGetterBase = require("File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import dotTpl = require("tmpl!File/ResourceGetter/FS");
import LocalFile = require("File/LocalFile");
import ExtensionsHelper = require("File/utils/ExtensionsHelper");
import detection = require("Core/detection");

const AFTER_CLOSE_DELAY = 2000;

/**
 * Детектим отмену выбора файлов пользователем
 * @param {Function} handler
 */
let onClose = (handler: Function) => {
    /*
     * Различные модели телефонов могут стрелять onChange с большой задержкой при выборе нескольких файлов
     * и для них опасно стрелять Deferred.cancel по какому-то таймауту
     * поэтому, если пользователь отменил выбор файлов на мобилке, оставим подвисший Deferred
     * то тех пор, пока не будет позван метод получения файлов ещё раз, либо не вызовется destroy метод
     * как доставерные показатели, что предыдущее окно было закрыто
     */
    if (detection.isMobilePlatform) {
        return;
    }
    /*
     * Ловим получение фокуса страницой, как признак того, что окно выбора закрылось
     * Для этого ожидаем событие focusin - если браузер стреляет событие при закрытии окна (Chromium, Edge, IE)
     *
     * Firefox и Safari не стреляют focusin при закрытии окна, поэтому у них Deferred.cancel вызовится после нажатии
     * в область DOM, которая не была в фокусе до открытия окна выбора.
     * Это можно было покрыть событием mouseover, но неокоторые браузеры (включая Safari)
     * стреляют им при открытом окне выбора файлов
     */

    let focus = () => {
        // Фокус поймаем раньше, чем файлы появятся в input и тот стрельнёт onChange
        // поэтому с небольшой задержкой стреляем отмену Deferred'а, если нету файлов и он ещё не стрельнувший
        setTimeout(handler, AFTER_CLOSE_DELAY);
        document.removeEventListener("focusin", focus);
    };
    /*
     * навешивание обработчиков фокуса вынесем в асинхронную функцию:
     * Lib/Control/Control при клике на кнопку может отдать фокус другому контролу
     * в зависимости от опции activableByClick
     * но сделает это синхронно
     *
     * Если же не выносить через setTimeout то можем получить ситуацию, когда окошко выбора файлов открывается,
     * а фокус в этот момет придёт другому контролу и обработчик сработает,
     * а мы соответственно будем бумать, что окно закрылось
     */
    setTimeout(() => {
        document.addEventListener("focusin", focus);
    }, 0);
};
type Options = {
    multiSelect: boolean;
    extensions: Array<string>;
    element: HTMLElement;
}
const OPTION: Options = {
    /**
     * @cfg {Boolean} Выбрать несколько файлов
     * <wiTag group="Управление">
     * Позволяет выбрать несколько файлов
     * @name File/ResourceGetter/FS#multiSelect
     */
    multiSelect: false,
    /**
     * @cfg {Array<String>} Список расширений выбираемых файлов
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
     * @name File/ResourceGetter/FS#extensions
     */
    extensions: null,
    /**
     * @cfg {HTMLElement} DOM элемент - контейнер, в котором будет построен невидивый input[type=file]
     * посредством которого открывается окошко выбора файлов
     * <wiTag group="Управление">
     * По умолчанию: document.body
     * @name File/ResourceGetter/FS#element
     */
    element: null
};

/**
 * Класс, реализующий интерфейс получения файлов IResourceGetter через нативное окошко
 *
 * В связи с политиками безопасности браузеров для выбора файла необходимо:
 * <ul>
 * <li>
 *     Экземпляр класса должен быть подготовлен заранее, т.к. input-элемент должен находиться в DOM до начала операции.
 * </li>
 * <li>
 *     Наличие пользовательского события
 * </li>
 * <li>
 *     Между пользовательским событием и вызовом метода .getFiles() не должно быть ленивых подгрузок модулей,
 *     а также вызовов БЛ
 * </li>
 * </ul>
 *
 * @class
 * @name File/ResourceGetter/FS
 * @extends File/ResourceGetter/Base
 * @public
 * @author Заляев А.В.
 */
class FS extends IResourceGetterBase {
    protected name = "FS";
    private _extensions: ExtensionsHelper;
    private _form: HTMLFormElement;
    private _inputBtn: HTMLInputElement;
    private _selectDef: Deferred<Array<LocalFile>>;
    private _options: Options;

    constructor(cfg: Partial<Options>) {
        super();
        this._options = Object.assign({}, OPTION, cfg);
        let container;
        container = this._options.element;
        if (!(container instanceof HTMLElement)) {
            container = document.body;
        }
        let element = document.createElement("div");
        element.innerHTML = dotTpl(this._options);
        container.appendChild(element);
        this._form = element.querySelector("form");
        this._inputBtn = <HTMLInputElement> this._form.querySelector("input[type=file]");
        this._inputBtn.onchange = () => {
            this._onChangeInput(this._inputBtn.files);
        };
        if (this._options.multiSelect) {
            this._inputBtn.setAttribute("multiple", "true");
        }

        this._extensions = new ExtensionsHelper(this._options.extensions);
        let mime = this._extensions.getMimeString();
        if (mime) {
            this._inputBtn.setAttribute("accept", mime);
        }
    }

    /**
     * Осуществляет выбор файлов через нативное окно
     * @description Deferred.cancel стреляет с задержкой после закрытия окна выбора.
     * Это связано необходимым временем между получением фокуса и отработкой onChange у input-элемента на маломощных эвм
     * Необходимо это учитывать при обработке errback у результата метода
     * @return {Core/Deferred<Array<File/LocalFile | Error>>}
     * @method
     * @name File/ResourceGetter/FS#getFiles
     * @see File/LocalFile
     */
    getFiles(): Deferred<Array<LocalFile | Error>> {
        if (this.isDestroy()) {
            return Deferred.fail("Resource getter is destroyed");
        }
        if (this._selectDef) {
            /*
             * сюда попадём, если не успели поймать фокус и обработать закрытие окна
             * например: клик по кнопке выбора -> esc -> клик по кнопке выбора
             */
            this._selectDef.cancel()
        }
        let def: Deferred<Array<LocalFile | Error>>;
        def = this._selectDef = new Deferred();
        // Перестает стрелять change'ом если выбрать тот же файл, поэтому зануляем форму перед кликом
        this._form.reset();

        // Детектим отмену выбора файлов пользователем
        onClose(() => {
            if (!def.isReady() && !this._inputBtn.files.length) {
                def.cancel();
                this._selectDef = null;
            }
        });

        this._inputBtn.click();
        return def;
    }

    /**
     * Возможен ли выбор файлов
     * @return {Core/Deferred<Boolean>}
     * @method
     * @name File/ResourceGetter/FS#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(!this.isDestroy());
    }

    /**
     * Обработчик события выбора файла в input
     * @param {FileList} selectedFiles
     * @private
     * @method
     * @name File/ResourceGetter/FS#_onChangeInput
     * @void
     */
    private _onChangeInput(selectedFiles: FileList) {
        if (this.isDestroy()) {
            return;
        }
        this._selectDef.callback(this._extensions.verifyAndReplace(selectedFiles));
        this._selectDef = null;
    }

    destroy() {
        if (this.isDestroy()) {
            return;
        }
        this._form.remove && this._form.remove();
        this._form = null;
        this._inputBtn = null;
        if (this._selectDef && !this._selectDef.isReady()) {
            this._selectDef.cancel();
        }
        super.destroy();
    }
}

export = FS;
