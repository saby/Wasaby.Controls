/// <amd-module name='File/Downloader' />
import FileDriver = require('File/Driver/Interface');

class Downloader {
   constructor(private fileDriver: FileDriver) { }

   public save(entity: string|Blob, name?: string, options?: Object) {
      if (!entity) {
         throw new Error("Некорректный аргумент entity: " + typeof entity);
      }

      let file = new this.fileDriver(entity)
      file.save(name || entity, options);
   }
}
export = Downloader;