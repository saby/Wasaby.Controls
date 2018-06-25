/// <amd-module name="File/Attach/Option/Getters/PhotoCam" />

import ResourceGetter = require("File/Attach/Option/ResourceGetter");

const GETTER_LINK = "File/ResourceGetter/PhotoCam";
const GETTER_TYPE = "PhotoCam";

/**
 * Класс конфигурации IResourceGetter для получения снимков с камеры, передаваемый в Attach
 * @class
 * @name File/Attach/Option/Getters/PhotoCam
 * @extends File/Attach/Option/ResourceGetter
 * @public
 * @author Заляев А.В.
 */
class PhotoCam extends ResourceGetter {
    /**
     * @param {*} [options] Параметры вызова конструктора
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (options?: any) {
        super (GETTER_LINK, GETTER_TYPE, options || {});
    }
    /**
     * @description 
     * Тип геттера передается в метод choose File/Attach, чтобы указать каким способом(геттером) выбираются файлы
     * <pre>
     *   attach.choose(PhotoCam.getType()); // Получение фото с веб-камеры
     * </pre>
     * @static
     * @method
     * @returns {String} Тип Getter'a
     */
    static getType(){
       return GETTER_TYPE;
    }
}
export = PhotoCam;
