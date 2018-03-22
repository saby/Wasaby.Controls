define([
   'Lib/File/Attach/BaseAttach',
   'Core/Deferred',
   'Core/constants',
   'Tests/Unit/File/GetResources',
   'Tests/Unit/File/GetterMock',
   'Tests/Unit/File/SourceMock',
   'Lib/File/LocalFile',
   'Lib/File/LocalFileLink',
   'Lib/File/HttpFileLink'
], function (BaseAttach, Deferred, constants, GetResources, GetterMock, SourceMock, LocalFile, LocalFileLink, HttpFileLink) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return;
   }
   mocha.setup({
      ignoreLeaks: true
   });

   describe('Controls/File/BaseAttach', function () {
      var IFileDataConstructors = [LocalFile, LocalFileLink, HttpFileLink];

      describe('.getSelectedResource()', function () {
         var attach = new BaseAttach();
         var files = [GetResources('LocalFile'), GetResources('LocalFile')];

         it('Возвращает пустой набор ресурсов', function () {
            assert.lengthOf(attach.getSelectedResource(), 0);
         });

         it('Возвращает набор выбраных ресурсов', function () {
            attach.addSelectedResource(files);
            assert.sameMembers(attach.getSelectedResource(), files);
         });
      });

      describe('.addSelectedResource()', function () {
         var attach;
         var file1 = GetResources('LocalFile');
         var file2 = GetResources('LocalFile');
         var fileLink1 = GetResources('LocalFileLink');
         var fileLink2 = GetResources('LocalFileLink');
         var httpLink1 = GetResources('HttpFileLink');
         var httpLink2 = GetResources('HttpFileLink');

         beforeEach(function () {
            attach = new BaseAttach();
         });

         afterEach(function () {
            attach.destroy();
         });

         it('Добавляет 1 ресурс к списку выбранных', function () {
            attach.addSelectedResource(file1);
            assert.sameMembers(attach.getSelectedResource(), [file1]);
         });

         it('Добавляет несколько LocalFile к списку выбранных', function () {
            attach.addSelectedResource([file1, file2]);
            assert.sameMembers(attach.getSelectedResource(), [file1, file2]);
         });

         it('Добавляет несколько LocalFileLink к списку выбранных', function () {
            attach.addSelectedResource([fileLink1, fileLink2]);
            assert.sameMembers(attach.getSelectedResource(), [fileLink1, fileLink2]);
         });

         it('Добавляет несколько HttpFileLink к списку выбранных', function () {
            attach.addSelectedResource([httpLink1, httpLink2]);
            assert.sameMembers(attach.getSelectedResource(), [httpLink1, httpLink2]);
         });

         it('Добавляет несколько LocalFile, LocalFileLink, HttpFileLink к списку выбранных', function () {
            attach.addSelectedResource([file1, fileLink1, httpLink2]);
            assert.sameMembers(attach.getSelectedResource(), [file1, fileLink1, httpLink2]);
         });
      });

      describe('.clearSelectedResource()', function () {
         var attach = new BaseAttach();
         var file1 = GetResources('LocalFile');
         var fileLink1 = GetResources('LocalFileLink');
         var httpLink1 = GetResources('HttpFileLink');

         attach.addSelectedResource([file1, fileLink1, httpLink1]);

         it('Очищает набор выбраных ресурсов', function () {
            attach.clearSelectedResource();
            assert.lengthOf(attach.getSelectedResource(), 0);
         });
      });

      describe('.getRegisteredResource()', function () {
         var attach = new BaseAttach();

         for (var i = 0; i < IFileDataConstructors.length; i++) {
            attach.registerSource(IFileDataConstructors[i], new SourceMock(IFileDataConstructors[i]));
         };

         var resources = attach.getRegisteredResource();

         it('Возвращает Array конструкторов над ресурсами, для которых зарегистрирован ISource', function () {
            assert.isArray(resources);
         });

         it('Возвращает IFileDataConstructor', function () {
            var isFileDataConstructor = resources.map(function (res) {
               return IFileDataConstructors.indexOf(res) !== -1;
            }).reduce(function (a, b) {
               return a && b;
            });
            assert.isTrue(isFileDataConstructor);
         });
      });

      describe('.setSelectedResource()', function () {
         var attach = new BaseAttach();
         var files = [GetResources('LocalFile'), GetResources('LocalFile')];

         attach.setSelectedResource(files);

         it('Устанавливает ресурсы в список выбранных', function () {
            assert.sameDeepMembers(attach.getSelectedResource(), files);
         });
      });

      describe('.choose()', function () {
         var attach = new BaseAttach();
         var files = [GetResources('LocalFile')];
         var getter = new GetterMock({
            chosenFiles: files
         });

         attach.registerGetter(getter);
         var def = attach.choose(getter.getType());

         it('attach.choose() returns Core/Deferred', function () {
            assert.instanceOf(def, Deferred);
         });

         def.addCallback(function (chosenFiles) {
            it('return Deferred<Array>', function () {
               assert.isArray(chosenFiles);
            });
            return chosenFiles;
         }).addCallback(function (chosenFiles) {
            it('Метод choose() корректно выбирает файлы', function () {
               assert.sameDeepMembers(chosenFiles, files);
            });
         });
      });

      describe('.registerGetter()', function () {
         var attach = new BaseAttach();
         var getterType, resource;
         var resources = [
            [GetResources('LocalFile'), GetResources('LocalFile')],
            [GetResources('LocalFileLink'), GetResources('LocalFileLink')],
            [GetResources('HttpFileLink'), GetResources('HttpFileLink')]
         ];

         var getters = [
            new GetterMock({
               chosenFiles: resources[0],
               type: 'LocalFileGetter'
            }),
            new GetterMock({
               chosenFiles: resources[1],
               type: 'LocalFileLinkGetter'
            }),
            new GetterMock({
               chosenFiles: resources[2],
               type: 'HttpFileLinkGetter'
            })
         ];

         for (var i = 0; i < getters.length; i++) {
            attach.registerGetter(getters[i]);
         }

         for (i = 0; i < getters.length; i++) {
            getterType = getters[i].getType();
            resource = resources[i];

            it(getterType + ' выбрал ожидаемые ресурсы', function (done) {
               attach.choose(getterType).addCallback(function (chosenFiles) {
                  assert.sameDeepMembers(chosenFiles, resource);
               }).addBoth(done);
            });
         }
      });

      describe('.upload()', function () {
         var attach = new BaseAttach();
         var resource = [GetResources('LocalFile')];
         var uploadResults, def;
         var params = {
            'param1': true,
            'param2': 5
         };

         attach.setSelectedResource(resource);
         attach.registerSource(LocalFile, new SourceMock(LocalFile));

         def = attach.upload(params);

         it('Метод upload() возвращает Deferred', function () {
            assert.instanceOf(def, Deferred);
         });

         it('Результат загрузки Array', function (done) {
            def.addCallback(function (results) {
               assert.isArray(results);
               uploadResults = results;
            }).addBoth(done);
         });

         it('Загрузка параметров', function (done) {
            def.addCallback(function () {
               uploadResults.forEach(function (res) {
                  assert.deepEqual(params, res.params);
               });
            }).addBoth(done);
         });

         it('Загрузка выбранных файлов', function (done) {
            def.addCallback(function () {
               uploadResults.forEach(function (res) {
                  assert.include(resource, res.file);
               });
            }).addBoth(done);
         });
      });

      describe('.registerSource()', function () {
         var attach = new BaseAttach();
         var resources = [
            GetResources('LocalFile'),
            GetResources('LocalFileLink'),
            GetResources('HttpFileLink')
         ];

         for (var i = 0; i < IFileDataConstructors.length; i++) {
            attach.registerSource(IFileDataConstructors[i], new SourceMock(IFileDataConstructors[i]));
         }

         attach.setSelectedResource(resources);
         it('Все Source для IFileData выбраны правильно', function (done) {
            /**
             * Экземпляр SourceMock при загрузке на него файла возвращает объект со следующими свойствами:
             * @param suitable {Boolean} true, если загруженный файл является экземпляром IFileDataContructor, с которым инициализировался экземпляр SourceMock 
             * (для тестирования registerLazySource/registerSource)
             * @param file {<IFileDataConstructor>} загруженный файл 
             * (для тестирования upload)
             * @param params {Object} Полученные параметры при загрузке файла
             * (для тестирования upload)
             */
            attach.upload().addCallback(function (results) {
               results.forEach(function (res) {
                  assert.isTrue(res.suitable);
               });
            }).addBoth(done);
         });
      });
   });
});