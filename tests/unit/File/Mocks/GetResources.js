define('tests/unit/File/Mocks/GetResources', [
   'Core/constants',
   'File/LocalFile',
   'File/LocalFileLink',
   'File/HttpFileLink'
], function (constants, LocalFile, LocalFileLink, HttpFileLink) {
   'use strict';

   if (!constants.isBrowserPlatform) {
      return function () {};
   }

   return function (ResourceConstructor, meta, name) {
      meta = meta || 'meta file info';
      name = name || Math.random().toString().substr(2) + ".png";

      if (ResourceConstructor === LocalFile) {
         return new LocalFile(new Blob(['File' + name]), meta, name);
      }
      if (ResourceConstructor === LocalFileLink) {
         return new LocalFileLink('file:///C:/' + name, meta);
      }
      if (ResourceConstructor === HttpFileLink) {
         return new HttpFileLink('http://example.com/' + name, meta);
      }
      throw Error('Unknown ResourceConstructor!');
   }
});
