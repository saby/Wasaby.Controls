define('js!SBIS3.CONTROLS.RichEditorUtils',
   [
      'Core/core-merge',
      'Core/Deferred'
   ],
   function (coreMerge, Deferred) {
      'use strict';

      /**
       * Получить из загрузчика изображений размер загружаемого изображения
       * @protected
       * @param {object} uploader Загрузчик изображений (как правило, получаемыый как Di.resolve('ImageUploader').getFileLoader(...) )
       * @param {Core/Deferred} canceler Отложенный останов на случай отмены действия
       * @return {Core/Deferred}
       */
      var _waitImageSize = function (uploader, canceler) {
         if (!uploader || typeof uploader !== 'object') {
            throw new TypeError('Argument "uploader" is not valid');
         }
         if (!(canceler && canceler instanceof Deferred)) {
            throw new TypeError('Argument "canceler" is not valid');
         }
         if (typeof File === 'undefined' || typeof FileReader === 'undefined') {
            return Deferred.fail();
         }
         var promise = new Deferred();
         var started;
         var canceled;
         var handler = function (evtName, evt1, evt2) {
            started = true;
            var reader;
            if (!canceled && evt2 && evt2.file) {
               var file = evt2.file.file;
               if (file && file instanceof File) {
                  reader = new FileReader();
                  var onErr = promise.errback.bind(promise);
                  reader.onload = function (evt3) {
                     if (!canceled) {
                        var img = new Image();
                        img.onload = function (evt4) {
                           if (!canceled) {
                              promise.callback({width: img.width, height: img.height, size: evt3.total});
                           }
                        };
                        img.onerror = onErr;
                        img.src = reader.result;
                     }
                  };
                  reader.onerror = onErr;
                  reader.readAsDataURL(file);
               }
            }
            if (!reader) {
               promise.errback();
            }
         };
         uploader.once('onstartcreateattachment', handler);
         canceler.addCallback(function () {
            if (!promise.isReady()) {
               if (!started) {
                  uploader.unsubscribe('onstartcreateattachment', handler);
               }
               canceled = true;
               promise.errback();
            }
         });
         return promise;
      };



      return {
         /**
          * Начать загрузку (upload) изображения через указанный загрузчик. Оболочка над оригинальным методом загрузчика. По завершении загрузки к информации о загруженном файле будет добавлена информация о размерах
          * @public
          * @param {object} uploader Загрузчик изображений (как правило, получаемыый как Di.resolve('ImageUploader').getFileLoader(...) )
          * @param {jQuery} $target (аргумент оригинального метода)
          * @param {boolean} multiSelect (аргумент оригинального метода)
          * @param {string} folder (аргумент оригинального метода)
          * @param {Core/Deferred} canceler Отложенный останов на случай отмены действия
          * @return {Core/Deferred}
          */
         startFileLoad: function (uploader, $target, multiSelect, folder, canceler) {
            if (!uploader || typeof uploader !== 'object' || typeof uploader.startFileLoad !== 'function') {
               throw new TypeError('Argument "uploader" is not valid');
            }
            if (!(canceler && canceler instanceof Deferred)) {
               throw new TypeError('Argument "canceler" is not valid');
            }
            var sizeWaiter = _waitImageSize(uploader, canceler);
            return uploader.startFileLoad($target, multiSelect, folder).addCallback(function (fileInfo) {
               return sizeWaiter.isReady() && sizeWaiter.isSuccessful() ? coreMerge(fileInfo, sizeWaiter.getResult()) : fileInfo;
            });
         }
      };

   }
);