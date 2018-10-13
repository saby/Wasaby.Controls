/// <amd-module name='File/Driver/Interface' />

export interface FileDriver {
    /**
     * Начинает загрузку файла
     * @param {FileParams} fileParams Параметры загрузки
     */
    download(fileParams?: FileParams): Promise<Response | void | Error>;
}

/** 
 * @property {String} name имя под которым будет сохранен файл
 * @property {String} contentType тип скачиваемого файла 
 * @interface {Object} FileParams
 */
export interface FileParams {
    [name: string]: string;
    contentType: string;
}
