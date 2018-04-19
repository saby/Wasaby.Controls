/// <amd-module name='File/Downloader' />
import DriverInterface = require('File/Driver/Interface');

let Downloader = (entity: string, options?: Object, driverName?: DriversNames) => {
   if (!entity) {
      throw new Error("Некорректный аргумент entity: " + typeof entity);
   }
   
   require([driverName || DetectDriverName(entity)], function(Driver: DriverInterface){
      new Driver(entity).download(options);
   });
}

let DetectDriverName = (entity: string) => {
   if (entity.indexOf('https://') !== -1 || entity.indexOf('?') !== -1 || entity.indexOf('&') !== -1) {
      return DriversNames.URL;
   }
   return DriversNames.Base64;
}

enum DriversNames {
   URL = 'File/Driver/URL',
   Base64 = 'File/Driver/Base64'
}

export = Downloader;