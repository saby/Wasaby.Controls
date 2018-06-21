/// <amd-module name="File/ResourceGetter/FileSystem" />

import ResourceGetterBase = require("File/ResourceGetter/Base");
import Deferred = require("Core/Deferred");
import LocalFile = require("File/LocalFile");
import ExtensionsHelper = require("File/utils/ExtensionsHelper");
import filter = require("File/utils/filter");

const SEC = 1000;
const MIN = 60 * SEC;
const AFTER_FOCUS_DELAY = 2 * MIN;

/**
 * Детектим отмену выбора файлов пользователем
 * @param {Function} handler
 */
let setTimeoutAfterFocus = (handler) => {
    let timeout: number;
    /*
     * Ловим получение фокуса страницой, как признак того, что окно выбора закрылось
     */
    let focus = (event) => {
        timeout = setTimeout(handler, AFTER_FOCUS_DELAY);
        document.removeEventListener("focusin", focus);
    };
    /*
     * Навешивание обработчиков фокуса вынесем в асинхронную функцию:
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
    return () => {
        clearTimeout(timeout);
    }
};
type Options = {
    multiSelect: boolean;
    extensions: Array<string>;
    element: HTMLElement;
    maxSize: number;
}
const OPTION: Options = {
    /**
     * @cfg {Boolean} Выбрать несколько файлов
     * <wiTag group="Управление">
     * Позволяет выбрать несколько файлов
     * @name File/ResourceGetter/FileSystem#multiSelect
     */
    multiSelect: false,
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
     * @name File/ResourceGetter/FileSystem#extensions
     */
    extensions: null,
    /**
     * @cfg {HTMLElement} DOM элемент - контейнер, в котором будет построен невидивый input[type=file]
     * посредством которого открывается окошко выбора файлов
     * <wiTag group="Управление">
     * По умолчанию: document.body
     * @name File/ResourceGetter/FileSystem#element
     */
    element: null,
    /**
     * @cfg {Number} Максимальный размер файла доступный для выбора (в МБ)
     * @name File/ResourceGetter/FileSystem#maxSize
     */
    maxSize: undefined
};
type CreateConfig = {
    mime: string;
    parent: HTMLElement;
    multiSelect: boolean;
}
let createInput = ({parent, mime, multiSelect}: CreateConfig) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("name", "file1");
    input.classList.add("ws-hidden");

    if (mime) {
        input.setAttribute("accept", mime);
    }
    if (multiSelect){
        input.setAttribute("multiple", "true");
    }

    if (!(parent instanceof HTMLElement)){
        parent = document.body;
    }
    parent.appendChild(input);

    return input;
};

/**
 * Класс, реализующий интерфейс получения файлов {@link File/IResourceGetter} через нативное окошко
 *
 * В связи с политиками безопасности браузеров для выбора файла необходимо:
 * <ul>
 *      <li> Наличие пользовательского события</li>
 *      <li>
 *          Между пользовательским событием и вызовом метода .getFiles() не должно быть ленивых подгрузок модулей,
 *          вызовов БЛ, либо других асинхронных операций
 *      </li>
 * </ul>
 *
 * @class
 * @name File/ResourceGetter/FileSystem
 * @extends File/ResourceGetter/Base
 * @public
 * @author Заляев А.В.
 */
class FileSystem extends ResourceGetterBase {
    protected name = "FileSystem";
    private _extensions: ExtensionsHelper;
    private _mime: string;
    private _options: Options;

    constructor(cfg: Partial<Options>) {
        super();
        this._options = Object.assign({}, OPTION, cfg);
        this._extensions = new ExtensionsHelper(this._options.extensions);
        this._mime = this._extensions.getMimeString();
    }

    /**
     * Осуществляет выбор файлов через нативное окно
     * @description Deferred.cancel стреляет с задержкой после закрытия окна выбора.
     * Это связано необходимым временем между получением фокуса и отработкой onChange у input-элемента на маломощных эвм
     * Необходимо это учитывать при обработке errback у результата метода
     * @return {Core/Deferred.<Array.<File/LocalFile | Error>>}
     * @method
     * @name File/ResourceGetter/FileSystem#getFiles
     * @see File/LocalFile
     */
    getFiles(): Deferred<Array<LocalFile | Error>> {
        if (this.isDestroyed()) {
            return Deferred.fail("Resource getter is destroyed");
        }
        /**
         * Между выбором пользователем файлов и срабатыванием события о выборе (фактическом попадании сущности FileList
         * внутрь input) есть некий промежуток времени, который
         * а) может зависить от количества и размера выбранных файлов
         * б) зависит от типа и вычеслительных возможностей устройств
         *
         * Цифра может колебляться от 2мс до 2с, однако если браузер поймает фриз, она переваливает
         * Этот плавающий показатель не даёт нам вовремя понимать, где пользователь просто загрыл окно выбора,
         * а где именно этот промежуток до события onchange.
         *
         * Поэтому убиваем deferred из памяти только через пару минут
         *
         * А чтобы не было проблем, когда пользователь открыл откно - отменил - снова открыл, пока мы не убедились,
         * что предыдущее окно было реально отменено, создаём каждый раз новый input под каждый deferred
         * и зачищаем его после работы
         */
        let input = createInput({
            mime: this._mime,
            multiSelect: this._options.multiSelect,
            parent: this._options.element
        });
        let def: Deferred<Array<LocalFile | Error>> = new Deferred().
            // Фильтруем и преобразуем выбранные файлы в массив из ошибок или LocalFile
            addCallback((files: FileList) => {
                return filter(files, {
                    extensions: this._extensions,
                    maxSize: this._options.maxSize
                });
        }).
            // убираем отработанные input'ы
            addBoth((result) => {
                input.remove && input.remove();
                return result;
            });
        // Убиваем из памяти отменённый deferred
        let clearTimeout = setTimeoutAfterFocus(() => {
            if (!def.isReady()) {
                def.cancel();
            }
        });
        // Заускаем deferred по событию
        input.onchange = () => {
            // timeout уже не нужен
            clearTimeout();

            let selectedFiles: FileList = input.files;
            def.callback(selectedFiles);
        };
        input.click();
        return def;
    }

    /**
     * Возможен ли выбор файлов
     * @return {Core/Deferred.<Boolean>}
     * @method
     * @name File/ResourceGetter/FileSystem#canExec
     */
    canExec(): Deferred<boolean> {
        return Deferred.success(!this.isDestroyed());
    }
}

export = FileSystem;
