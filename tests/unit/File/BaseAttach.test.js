define([
   'Core/constants',
   './Mocks/GetResources',
   './Mocks/ISource',
   './Mocks/ResourceGetter'
], function (constants) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return;
   }
   require([
      'File/Attach/Base',
      'Core/Deferred',
      'File/LocalFile',
      'File/LocalFileLink',
      'File/HttpFileLink',
      'tests/unit/File/Mocks/GetResources',
      'tests/unit/File/Mocks/ResourceGetter',
      'tests/unit/File/SourceMock'
   ], function (BaseAttach, Deferred, LocalFile, LocalFileLink, HttpFileLink, GetResources, IResourceGetter, ISource) {
      describe('File/Attach/Base', function () {
         var IFileDataConstructors = [LocalFile, LocalFileLink, HttpFileLink];

         describe('.getSelectedResource()', function () {
            var attach = new BaseAttach();
            var files = [GetResources(LocalFile), GetResources(LocalFile)];

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
            var file1 = GetResources(LocalFile);
            var file2 = GetResources(LocalFile);
            var fileLink1 = GetResources(LocalFileLink);
            var fileLink2 = GetResources(LocalFileLink);
            var httpLink1 = GetResources(HttpFileLink);
            var httpLink2 = GetResources(HttpFileLink);

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
            var localFile = GetResources(LocalFile);
            var localLink = GetResources(LocalFileLink);
            var httpLink = GetResources(HttpFileLink);

            attach.addSelectedResource([localFile, localLink, httpLink]);

            it('Очищает набор выбраных ресурсов', function () {
               attach.clearSelectedResource();
               assert.lengthOf(attach.getSelectedResource(), 0);
            });
         });

         describe('.getRegisteredResource()', function () {
            var attach = new BaseAttach();

            for (var i = 0; i < IFileDataConstructors.length; i++) {
               attach.registerSource(IFileDataConstructors[i], new ISource(IFileDataConstructors[i]));
            }

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
            var files = [GetResources(LocalFile), GetResources(LocalFile)];

            attach.setSelectedResource(files);

            it('Устанавливает ресурсы в список выбранных', function () {
               assert.sameDeepMembers(attach.getSelectedResource(), files);
            });
         });

         describe('.choose()', function () {
            var attach = new BaseAttach();
            var files = [GetResources(LocalFile)];
            var getter = new IResourceGetter({
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
               [GetResources(LocalFile), GetResources(LocalFile)],
               [GetResources(LocalFileLink), GetResources(LocalFileLink)],
               [GetResources(HttpFileLink), GetResources(HttpFileLink)]
            ];

            var getters = [
               new IResourceGetter({
                  chosenFiles: resources[0],
                  type: 'LocalFileGetter'
               }),
               new IResourceGetter({
                  chosenFiles: resources[1],
                  type: 'LocalFileLinkGetter'
               }),
               new IResourceGetter({
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
            var resource = [GetResources(LocalFile)];
            var uploadResults, def;
            var params = {
               'param1': true,
               'param2': 5
            };

            attach.setSelectedResource(resource);
            attach.registerSource(LocalFile, new ISource(LocalFile));

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
               GetResources(LocalFile),
               GetResources(LocalFileLink),
               GetResources(HttpFileLink)
            ];

            for (var i = 0; i < IFileDataConstructors.length; i++) {
               attach.registerSource(IFileDataConstructors[i], new ISource(IFileDataConstructors[i]));
            }

            attach.setSelectedResource(resources);
            it('Все Source для IFileData выбраны правильно', function (done) {
               /**
                * Экземпляр SourceMock при загрузке на него файла возвращает объект со следующими свойствами:
                * @param suitable {Boolean} true, если загруженный файл является экземпляром IFileDataContructor, с которым инициализировался экземпляр SourceMock
                * (для тестирования registerLazySource/registerSource)
                * @param file {IFileDataConstructor} загруженный файл
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

         describe('onChosen event', function () {
            var attach = new BaseAttach();
            var localLink = GetResources(LocalFileLink);
            var getter = new IResourceGetter({
               chosenFiles: [localLink],
               type: 'FileSystem'
            });

            attach.registerGetter(getter);

            it('Выбор ресурса', function (done) {
               attach.subscribe('onChosen', function (event, chosenFile) {
                  assert.deepEqual(localLink, chosenFile);
                  done();
               });
               attach.choose(getter.getType());
            });
         });

         describe('onChosen event (setResult Error)', function () {
            var attach = new BaseAttach();
            var localLink = GetResources(LocalFileLink);
            var getter = new IResourceGetter({
               chosenFiles: [localLink],
               type: 'FileSystem'
            });

            attach.registerGetter(getter);
            attach.subscribe('onChosen', function (event, chosenFile) {
               event.setResult(new Error('Ошибка'));
            });

            it('Замена значения ресурса на Error', function (done) {
               attach.choose(getter.getType()).addCallback(function (res) {
                  assert.instanceOf(res[0], Error);
                  done();
               });
            });
         });

         describe('onChosen event (setResult LocalFile)', function () {
            var attach = new BaseAttach();
            var localLink = GetResources(LocalFileLink);
            var localFile = GetResources(LocalFile);
            var getter = new IResourceGetter({
               chosenFiles: [localLink],
               type: 'FileSystem'
            });

            attach.registerGetter(getter);
            attach.subscribe('onChosen', function (event, chosenFile) {
               event.setResult(localFile);
            });

            it('Замена значения ресурса на LocalFile', function (done) {
               attach.choose(getter.getType()).addCallback(function (res) {
                  assert.deepEqual(res[0], localFile);
                  done();
               });
            });
         });

         describe('onChosen event (setResult Deferred<LocalFile>)', function () {
            var attach = new BaseAttach();
            var localLink = GetResources(LocalFileLink);
            var localFile = GetResources(LocalFile);
            var getter = new IResourceGetter({
               chosenFiles: [localLink],
               type: 'FileSystem'
            });

            attach.registerGetter(getter);
            attach.subscribe('onChosen', function (event, chosenFile) {
               event.setResult(new Deferred().callback(localFile));
            });

            it('Замена значения ресурса на Deferred<LocalFile>', function (done) {
               attach.choose(getter.getType()).addCallback(function (res) {
                  assert.deepEqual(res[0], localFile);
                  done();
               });
            });
         });

         describe('onChooseError event', function () {
            var attach = new BaseAttach();
            var file = GetResources(LocalFile);
            var getter = new IResourceGetter({
               type: 'FileSystem',
               chosenFiles: [file, new Error('Chosen broken File')]
            });

            attach.registerGetter(getter);

            it('Вызвано событие onChooseError при неправильном вызове .choose()', function (done) {
               attach.subscribe('onChooseError', function () {
                  done();
               });
               attach.choose(getter.getType());
            });
         });

         describe('onLoadResourceError event', function () {
            var attach = new BaseAttach();
            var brokenSource = new ISource(LocalFileLink, false);
            var trueSource = new ISource(LocalFile, true);
            var localLink = GetResources(LocalFileLink);
            var file = GetResources(LocalFile); // не загрузится 

            attach.setSelectedResource([file, localLink]);
            attach.registerSource(LocalFileLink, brokenSource);
            attach.registerSource(LocalFile, trueSource);

            it('Вызвано событие onLoadResourceError при неправильной загрузке ресурса', function (done) {
               attach.subscribe('onLoadResourceError', function (event, resource, error) {
                  assert.deepEqual(resource, file);
                  assert.instanceOf(error, Error);
                  done();
               });
               attach.upload();
            });
         });

         describe('onLoaded event', function () {
            var attach = new BaseAttach();
            var source = new ISource();
            var file = GetResources(LocalFile);

            attach.setSelectedResource(file);
            attach.registerSource(LocalFile, source);

            it('Вызвано событие окончания загрузки ресурсов onLoaded', function (done) {
               attach.subscribe('onLoaded', function (event, response) {
                  assert.deepEqual(file, response[0].file);
                  done();
               });
               attach.upload();
            });
         });
      });
   })
});
