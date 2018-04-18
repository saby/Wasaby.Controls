/// <amd-module name='File/Driver/Base64' />
import base64toblob = require('File/utils/b64toBlob');
import BlobDriver = require('File/Driver/Blob');

class Base64  /** @lends Lib/File/Base64.prototype*/ {
   private base64Data: string;
   private contentType: string;

   constructor(data: string) {
      if (data.indexOf('data:') === -1) {
         this.base64Data = data;
         return;
      }
      this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
      this.base64Data = data.substring(data.indexOf(',') + 1);
   }

   public save(name: string, options?: object) {
      let type = (options && options['contentType']) ? options['contentType'] : this.contentType;
      let blob: Blob = base64toblob(this.base64Data, type);
      new BlobDriver(blob).save(name, type)
   }
}
export = Base64;
