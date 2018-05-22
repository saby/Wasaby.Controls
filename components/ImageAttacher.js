define('SBIS3.CONTROLS/ImageAttacher', [
   'WS.Data/Di',
   'Lib/File/Attach/LazyAttach',
   'Lib/File/ResourceGetter/FSGetter',
   'Lib/File/LocalFile'
], function (Di, LazyAttach, FSGetter, LocalFile) {
   'use strict';

   function ImageAttacher(options) {
      var attach = new LazyAttach({
         multiSelect: false
      });

      var fsGetter = new FSGetter({
         multiSelect: false,
         element: options.element,
         extensions: ['image']
      });

      attach.registerGetter(fsGetter);
      attach.registerLazyGetter('PhotoCam', 'Lib/File/ResourceGetter/PhotoCam', {
         openDialog: {
            dialogOptions: {
               opener: options.opener
            }
         }
      });

      attach.registerLazySource(LocalFile, 'WS.Data/Source/SbisFile', {
         endpoint: {
            //todo Удалить, временная опция для поддержки смены логотипа компании
            contract: options.contract
         },
         binding: options.binding
      });
      return attach;
   }

   Di.register('SBIS3.CONTROLS/ImageAttacher', ImageAttacher);
});
/**
 * Возвращает через DI подготовленный Attach под загрузку картинок в БЛ 
 * https://online.sbis.ru/opendoc.html?guid=f062da1d-d2e1-48a2-9950-46a86c8dd493 
 */