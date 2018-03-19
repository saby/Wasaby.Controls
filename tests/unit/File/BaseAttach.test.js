define([
   'Lib/File/Attach/BaseAttach',
   'Core/Deferred',
   'Core/constants',
   'Lib/File/LocalFile',
   'Lib/File/LocalFileLink',
   'Lib/File/HttpFileLink'
], function (BaseAttach, Deferred, constants, LocalFile, LocalFileLink, HttpFileLink) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return;
   }

   describe('Controls/File/BaseAttach', function () {
      var attach = new BaseAttach();
      var IFileDataConstructors = [LocalFile, LocalFileLink, HttpFileLink];

      var meta = 'meta file info';

      var file1 = new LocalFile(new Blob(['File 1!']), meta, 'file1name').getData();
      var file2 = new LocalFile(new Blob(['File 2!']), meta, 'file2name').getData();

      var fileLink1 = new LocalFileLink('file:///C:/file1.md');
      var fileLink2 = new LocalFileLink('file:///C:/file2.md');

      var httpLink1 = new HttpFileLink('http://example.com/file1.md');
      var httpLink2 = new HttpFileLink('http://example.com/file2.md');

      var getter = {
         // mock object IResourceGetterBase
         canExec: function () {
            return new Deferred().callback(true);
         },
         getFiles: function () {
            return new Deferred().callback([file1, file2]);
         },
         getType: function () {
            return 'ScannerGetter';
         }
      };
      var source = {
         // mock object ISource
         call: function () {
            return new Deferred().callback(true);
         },
         copy: function () {
            var self = this;
            return new Deferred().callback(self);
         },
         create: function () {
            return new Deferred().callback(true);
         },
         destroy: function () {
            return new Deferred().callback(true);
         },
         getBinding: function () {
            return {
               create: 'Add',
               read: 'Load',
               update: 'Save',
               destroy: 'Delete'
            };
         },
         getEndpoint: function () {
            return {
               address: '/api/',
               contract: 'User'
            };
         },
         getIdProperty: function () {
            return 'id';
         },
         getListModule: function () {
            return 'collection.recordset';
         },
         getModel: function () {
            return 'entity.model';
         },
         getOrderProperty: function () {
            return 'sort';
         },
         merge: function () {
            return new Deferred().callback(true);
         },
         move: function () {
            return new Deferred().callback(true);
         },
         read: function () {
            return new Deferred().callback(true);
         },
         update: function () {
            return new Deferred().callback(true);
         }
      };

      beforeEach(function () {
         attach = new BaseAttach();
      });

      afterEach(function () {
         attach = undefined;
      });

      describe('.getSelectedResource()', function () {
         it('Возвращает пустой набор выбраных ресурсов', function () {
            assert.lengthOf(attach.getSelectedResource(), 0);
         });

         it('Возвращает набор выбраных ресурсов', function () {
            attach.addSelectedResource([file1, file2]);
            var resources = attach.getSelectedResource();
            assert.sameMembers(resources, [file1, file2]);
         });
      });

      describe('.addSelectedResource()', function () {

         beforeEach(function () {
            attach = new BaseAttach();
         });

         afterEach(function () {
            attach = undefined;
         });

         it('Добавляет 1 ресурс к списку выбранных', function () {
            attach.addSelectedResource(file1);
            assert.sameMembers(attach.getSelectedResource(), [file1]);
         });

         it('Добавляет несколько LocalFile к списку выбранных', function () {
            attach.addSelectedResource([file1, file2]);
            assert.sameMembers(attach.getSelectedResource(), [file1, file1, file2]);
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
         attach.addSelectedResource([file1, fileLink1, httpLink1]);

         it('Очищает набор выбраных ресурсов', function () {
            attach.clearSelectedResource();
            assert.lengthOf(attach.getSelectedResource(), 0);
         });
      });

      describe('.getRegisteredResource()', function () {
         attach.registerSource(LocalFile, source);
         attach.registerSource(LocalFileLink, source);
         attach.registerSource(HttpFileLink, source);
         var resources = attach.getRegisteredResource();

         it('Возвращает список конструкторов над ресурсами, для которых зарегистрирован ISource', function () {
            assert.isTrue(Array.isArray(resources));
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
         attach.setSelectedResource([file1, file2]);
         var selectedResources = attach.getSelectedResource();
         it('Устанавливает ресурсы в список выбранных', function () {
            assert.sameDeepMembers(selectedResources, [file1, file2]);
         });
      });

      describe('.choose()', function () {
         it('Вызов метода выбора ресурсов возвращает Deferred', function () {
            assert.instanceOf(attach.choose(getter.getType()), Deferred);
         });
      });

      describe('.registerGetter()', function () {
         attach.registerGetter(getter);
         var def = attach.choose(getter.getType());

         it('Регистрация IResourceGetter', function () {
            assert.isTrue(def.isSuccessful());
         });
      });

      describe('.upload()', function () {
         var def = attach.choose(getter.getType()).addCallback(function () {
            attach.upload();
         });

         it('Загрузка выбранных ресурсов возвращает Deferred', function () {
            assert.instanceOf(def, Deferred);
         });
      });

      describe('.registerSource()', function () {
         attach.registerGetter(getter);
         attach.registerSource(LocalFileLink, source);
         var def = attach.choose(getter.getType()).addCallback(function () {
            attach.upload();
         });

         it('Регистрация ISource', function () {
            assert.isTrue(def.isSuccessful());
         });
      });
   });
});
