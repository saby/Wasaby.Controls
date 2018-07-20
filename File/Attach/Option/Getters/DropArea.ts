/// <amd-module name="File/Attach/Option/Getters/DropArea" />

import ResourceGetter = require("File/Attach/Option/Getter");
import DropAreaGetter = require("File/ResourceGetter/DropArea");

const GETTER_TYPE = "DropArea";

/**
 * Класс конфигурации IResourceGetter для выбора путём Drag&Drop, передаваемый в Attach
 * @class
 * @name File/Attach/Option/Getters/DropArea
 * @extends File/Attach/Option/Getter
 * @public
 * @author Заляев А.В.
 */
class DropArea extends ResourceGetter {
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
     * @name File/Attach/Option/Getters/DropArea#extensions
     */
    /**
     * @cfg {HTMLElement} DOM элемент для перетаскивания файлов
     * @name File/Attach/Option/Getters/DropArea#element
     */
    /**
     * @cfg {Function} Обработчик события onDrop элемента. Позволяет получать ресурсы не ожидая вызова метода getFiles
     * @name File/Attach/Option/Getters/DropArea#ondrop
     */
    /**
     * @cfg {String} Текст на внутреннем элементе во время перемещения файлов
     * @name File/Attach/Option/Getters/DropArea#dragText
     */
    /**
     * @cfg {String} Текст на внутреннем элементе во время перемещения файлов непосредственно над ним
     * @name File/Attach/Option/Getters/DropArea#dropText
     */
    /**
     * @cfg {String} Класс внутреннего элемента обёртки, содержащий текст
     * @name File/Attach/Option/Getters/DropArea#innerClass
     */
    /**
     * @param {Object} [options] Параметры вызова конструктора
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (options?: any) {
        super (new DropAreaGetter(options || {}));
    }
    /**
     * @description
     * Тип геттера передается в метод choose File/Attach, чтобы указать каким способом(геттером) выбираются файлы
     * <pre>
     *   attach.choose(DropArea.getType()); // Получение файлов посредством Drag&Drop
     * </pre>
     * @static
     * @method
     * @returns {String} Тип Getter'a
     */
    static getType() {
        return GETTER_TYPE;
    }
}
export = DropArea;
