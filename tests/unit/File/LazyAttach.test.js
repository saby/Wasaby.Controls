define([
   'Lib/File/Attach/LazyAttach',
   'Core/Deferred',
   'Core/constants',
   'Lib/File/LocalFile',
   'Lib/File/LocalFileLink',
   'Lib/File/HttpFileLink',
   'Tests/Unit/File/GetResources'
], function (LazyAttach, Deferred, constants, LocalFile, LocalFileLink, HttpFileLink, GetResources) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return;
   }

   describe('Controls/File/LazyAttach', function () {
      var getters = ['FileGetter', 'LinkGetter', 'HttpGetter'];

      describe('.registerLazyGetter()', function () {
         var attach = new LazyAttach();
         var resource, type, getter;
         var resources = [
            [GetResources('LocalFile')],
            [GetResources('LocalFileLink')],
            [GetResources('HttpFileLink')]
         ];

         for (var i = 0; i < getters.length; i++) {
            type = getters[i];
            attach.registerLazyGetter(type, 'Tests/Unit/File/GetterMock', {
               chosenFiles: resources[i],
               type: type
            });
         }

         for (i = 0; i < getters.length; i++) {
            getter = getters[i];
            resource = resources[i];

            it('Ленивая регистрация  ' + getter + ' для получения файлов', function (done) {
               attach.choose(getter)
                  .addCallbacks(
                     function (files) {
                        files.forEach(function (file) {
                           assert.include(resource, file);
                        });
                     },
                     function () {
                        assert(false, getter + ' зарегистрировался как GetterMock!');
                     })
                  .addBoth(done);
            });
         }
      });

      describe('.registerLazyGetter() некорректный вызов', function () {
         var attach = new LazyAttach();
         var getter;

         for (var i = 0; i < getters.length; i++) {
            attach.registerLazyGetter(getters[i], 'Tests/Unit/File/GetterMock');
         }

         for (i = 0; i < getters.length; i++) {
            getter = getters[i];
            it('Обработка некорректной ленивой регистрации <' + getter + '>', function (done) {
               attach.choose(getter)
                  .addCallbacks(
                     function (files) {
                        assert(false, getter + ' зарегистрировался как GetterMock!');
                     },
                     function (err) {
                        assert.instanceOf(err, Error);
                     })
                  .addBoth(done);
            });
         };
      });

      describe('.registerLazySource()', function () {
         var attach = new LazyAttach();
         var resources = [GetResources('LocalFile'), GetResources('LocalFileLink'), GetResources('HttpFileLink')];
         var IFileDataConstructor = [LocalFile, LocalFileLink, HttpFileLink];

         it('Ленивая регистрация ISource для загрузки файлов', function (done) {
            attach.setSelectedResource(resources);
            IFileDataConstructor.forEach(function (Contructor) {
               attach.registerLazySource(Contructor, 'Tests/Unit/File/SourceMock', Contructor);
            });

            /**
             * Экземпляр SourceMock при загрузке на него файла возвращает объект со следующими свойствами:
             * @param suitable {Boolean} true, если загруженный файл является экземпляром IFileDataContructor, с которым инициализировался экземпляр SourceMock 
             * (для тестирования registerLazySource/registerSource)
             * @param file {<IFileDataConstructor>} загруженный файл 
             * (для тестирования upload)
             * @param params {Object} Полученные параметры при загрузке файла
             * (для тестирования upload)
             */
            attach.upload().addCallback(function (response) {
               response.forEach(function (res) {
                  assert.isTrue(res.suitable);
               });
            }).addBoth(done);
         });
      });
   });
});