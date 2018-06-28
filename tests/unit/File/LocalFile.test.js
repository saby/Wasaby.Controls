define([
   'File/LocalFile',
   'Core/constants'
], function (LocalFile, constants) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return;
   }

   var meta = 'meta file info';
   var file = new Blob(['Hello world!'], {
      type: 'text/plain'
   });
   var localFile = new LocalFile(file, meta, 'filename');

   describe('File/LocalFile', function () {

      describe('.getData()', function () {
         it('Возвращает файл', function () {
            assert.equal(localFile.getData(), file);
         });
      });

      describe('.getMeta()', function () {
         it('Возвращает дополнительную информацию по файлу', function () {
            assert.equal(localFile.getMeta(), meta);
         });
      });
   });
});
