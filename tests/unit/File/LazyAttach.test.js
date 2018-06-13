define([
   'Core/constants',
   './Mocks/GetResources',
   './Mocks/ResourceGetter',
   './Mocks/ISource'
], function (constants) {
   'use strict';
   if (!constants.isBrowserPlatform) {
      return;
   }

   require([
       'File/Attach/Lazy',
       'Core/Deferred',
       'File/LocalFile',
       'File/LocalFileLink',
       'File/HttpFileLink',
       'tests/unit/File/Mocks/GetResources'
   ], function(LazyAttach, Deferred, LocalFile, LocalFileLink, HttpFileLink, GetResources) {
       describe('File/LazyAttach', function () {
           var getters = ['FileGetter', 'LinkGetter', 'HttpGetter'];

           describe('.registerLazyGetter()', function () {
               var attach = new LazyAttach();
               var resources = [
                   [GetResources(LocalFile)],
                   [GetResources(LocalFileLink)],
                   [GetResources(HttpFileLink)]
               ];
               getters.forEach(function (getter, index) {
                   attach.registerLazyGetter(getter, 'tests/unit/File/Mocks/ResourceGetter', {
                       chosenFiles: resources[index],
                       type: getter
                   });
               });

               getters.forEach(function (getter, index) {
                   var resource = resources[index];
                   it('Ленивая регистрация  ' + getter + ' для получения файлов', function (done) {
                       attach.choose(getter).addCallback(function (files) {
                           files.forEach(function (file) {
                               assert.include(resource, file);
                           });
                       }).addBoth(done);
                   });
               });
           });

           describe('.registerLazyGetter() некорректный вызов', function () {
               var attach = new LazyAttach();
               var RIGHT_GETTER_NAME = "RightGetter";
               var WRONG_GETTER_NAME = "WrongGetter";
               attach.registerLazyGetter(WRONG_GETTER_NAME, 'tests/unit/File/Mocks/ResourceGetter', {
                   type: RIGHT_GETTER_NAME
               });
               it('Обработка регистрации с некоректно переданным type', function (done) {
                   attach.choose(WRONG_GETTER_NAME).addCallbacks(function (files) {
                       assert(false, RIGHT_GETTER_NAME + ' зарегистрировался как ' + WRONG_GETTER_NAME);
                   }, function(error) {
                       // тут всё ок, но ошибка не должна уйти в done
                   }).addBoth(function() {
                       attach.destroy();
                   }).addBoth(done);
               });
           });

           describe('.registerLazySource()', function () {
               var attach = new LazyAttach();
               var resources = [GetResources(LocalFile), GetResources(LocalFileLink), GetResources(HttpFileLink)];
               var IFileDataConstructor = [LocalFile, LocalFileLink, HttpFileLink];

               it('Ленивая регистрация ISource для загрузки файлов', function (done) {
                   attach.setSelectedResource(resources);
                   IFileDataConstructor.forEach(function (Contructor) {
                       attach.registerLazySource(Contructor, 'tests/unit/File/SourceMock', Contructor);
                   });

                   /**
                    * Экземпляр SourceMock при загрузке на него файла возвращает объект со следующими свойствами:
                    * @param suitable {Boolean} true, если загруженный файл является экземпляром IFileDataContructor, с которым инициализировался экземпляр SourceMock
                    * (для тестирования registerLazySource/registerSource)
                    * @param file {IFileDataConstructor} загруженный файл
                    * (для тестирования upload)
                    * @param params {Object} Полученные параметры при загрузке файла
                    * (для тестирования upload)
                    */
                   attach.upload().addCallback(function (response) {
                       response.forEach(function (res) {
                           assert.isTrue(res.suitable);
                       });
                   }).addBoth(function() {
                       attach.destroy();
                   }).addBoth(done);
               });
           });
       });
   });
});
