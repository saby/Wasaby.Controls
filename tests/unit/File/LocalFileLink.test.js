define([
   'File/LocalFileLink'
], function (LocalFileLink) {
   'use strict';

   var meta = 'meta file info';
   var link = 'file:///C:/file1.md';
   var fileLink = new LocalFileLink(link, meta);

   describe('File/LocalFileLink', function () {

      describe('.getLink()', function () {
         it('Возвращает ссылку на файл, находящийся на локальном устройстве', function () {
            assert.equal(fileLink.getLink(), link);
         });
      });

      describe('.getMeta()', function () {
         it('Возвращает дополнительную информацию по файлу', function () {
            assert.equal(fileLink.getMeta(), meta);
         });
      });
   });
});
