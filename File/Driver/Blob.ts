/// <amd-module name='File/Driver/Blob' />
import DriverInterface = require('File/Driver/Interface');
import detection = require('Core/detection');

class Blob implements DriverInterface {
   private name: string = 'noname';

   constructor(private blob: Blob) { }

   public download(options?: Object) {
      let name = (options) ? options['name'] : this.name;
      if (detection.isIE) {
         window.navigator.msSaveOrOpenBlob(this.blob, name);
         return;
      }
      let url: string = URL.createObjectURL(this.blob);
      let link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link).click();
      URL.revokeObjectURL(url);
   }
}
export = Blob;
