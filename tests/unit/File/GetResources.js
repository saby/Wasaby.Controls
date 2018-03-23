define('Tests/Unit/File/GetResources', [
   'Lib/File/LocalFile',
   'Lib/File/LocalFileLink',
   'Lib/File/HttpFileLink'
], function (LocalFile, LocalFileLink, HttpFileLink) {
   return function (ResourceConstructorName, meta, name) {
      meta = meta || 'meta file info';
      name = name || Math.random().toString().substr(2) + ".png";

      if (ResourceConstructorName === 'LocalFile') {
         return new LocalFile(new Blob(['File' + name]), meta, name);
      }
      if (ResourceConstructorName === 'LocalFileLink') {
         return new LocalFileLink('file:///C:/' + name, meta);
      }
      if (ResourceConstructorName === 'HttpFileLink') {
         return new HttpFileLink('http://example.com/' + name, meta);
      }
      throw Error('Unknow ResourceConstructor`s name!');
   }
});