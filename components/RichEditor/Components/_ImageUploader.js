define('SBIS3.CONTROLS/RichEditor/Components/_ImageUploader', [
    'Core/Deferred',
    'WS.Data/Di',
    'Lib/File/Attach/SbisAttach',
    'Lib/File/Attach/Option/Sources/FileStorage',
    'Lib/File/Attach/Option/Getters/FS'
], function(Deferred, Di, SbisAttach, FileStorage, FSGetter) {
    'use strict';

    var attach;
    var getAttach = function() {
        if (attach) {
            return attach;
        }
        attach = new SbisAttach({
            getterOptions: [new FSGetter({
                multiSelect: false,
                extensions: ['image']
            })],
            sourceOptions: [new FileStorage()]
        });
        return attach;
    };

    /**
     * Выбор и загрузка изображениея в FileStorage
     * @return {Core/Deferred}
     */
    var startFileLoad = function() {
        var attach = getAttach();
        return attach.choose("FSGetter").addCallback(function() {
            if (!attach.getSelectedResource().length) {
                return new Deferred().cancel();
            }
            return attach.upload();
        }).addCallback(function(results) {
            /*
             * results: Array<Model | Error>
             * т.к. ресурс загружаемый один, то разворачиваем массив и вернём первый элемент
             * так ошибка при загрузке уйдёт в errback, а результат в следующий шаг
             */
            return results[0];
        }).addCallback(function(model) {
            return model.getRawData();
        });
    };

    var Loader = function() {
        this.startFileLoad = startFileLoad;
    };
    var ImageLoader = {
        getFileLoader: function() {
            return {
                startFileLoad: startFileLoad
            }
        },
        canMultiSelect: true
    };
    if (!Di.isRegistered('ImageUploader')){
        Di.register('ImageUploader', ImageLoader, {
            instantiate: false
        });
    }
    return Loader;
});
