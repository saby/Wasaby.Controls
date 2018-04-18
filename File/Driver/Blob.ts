/// <amd-module name='File/Driver/Blob' />
import detection = require('Core/detection');

class Blob {
   constructor(private blob: Blob) { }

   public save(name: string) {
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
