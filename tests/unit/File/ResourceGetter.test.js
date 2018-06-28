define([
   'File/Attach/Option/ResourceGetter',
   'Core/Deferred'
], function (ResourceGetter, Deferred) {
   'use strict';

   var getter = {
      // mock object IResourceGetterBase
      canExec: function () {
         return new Deferred().callback(true);
      },
      getFiles: function () {
         return new Deferred().callback([]);
      },
      getType: function () {
         return 'ScannerGetter';
      }
   };
   var getterLink = 'SBIS3.Plugin/components/Extensions/Integration/FileGetter/ScannerGetter';
   var getterName = 'ScannerGetter';
   var getterOptions = {
      'option1': true,
      'oprion2': []
   };

   describe('File/Attach/Option/ResourceGetter', function () {

      describe('.getGetter()', function () {

         it('Возвращает экземпляр IResourceGetter', function () {
            var resourceGetter = new ResourceGetter(getter);
            assert.equal(resourceGetter.getGetter(), getter);
         });

         it('Возвращает ссылку на модуль', function () {
            var resourceGetter = new ResourceGetter(getterLink);
            assert.equal(resourceGetter.getGetter(), getterLink);
         });
      });

      describe('.getName()', function () {
         it('Возвращает имя экземпляра IResourceGetter`a', function () {
            var resourceGetter = new ResourceGetter(getter, getterName);
            assert.equal(resourceGetter.getName(), getterName);
         });
      });

      describe('.getOptions()', function () {
         it('Возвращает параметры вызова конструктора', function () {
            var resourceGetter = new ResourceGetter(getter, getterName, getterOptions);
            assert.equal(resourceGetter.getOptions(), getterOptions);
         });
      });
   });
});
