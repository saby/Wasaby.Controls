define([
   'File/HttpFileLink'
], function (HttpFileLink) {
   'use strict';

   var meta = 'meta file info';
   var link = 'http://google.com';
   var httpLink = new HttpFileLink(link, meta);

   describe('File/HttpFileLink', function () {

      describe('.getLink()', function () {
         it('Возвращает ссылку на удалённый ресурс', function () {
            assert.equal(httpLink.getLink(), link);
         });
      });

      describe('.getMeta()', function () {
         it('Возвращает дополнительную информацию по файлу', function () {
            assert.equal(httpLink.getMeta(), meta);
         });
      });
   });
});
