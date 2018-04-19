/// <amd-module name='File/Driver/URL' />
import DriverInterface = require('File/Driver/Interface');
import detection = require('Core/detection');

class URL implements DriverInterface {
   constructor(private url: string) { }

   public download() {
      if (detection.isMobilePlatform) {
         window.open(this.url, '_self');
         return;
      }
      if (detection.firefox || detection.safari) {
         this.downloadByIframe(this.url);
         return;
      }
      this.downloadByA(this.url);
   }

   protected downloadByA(url: string) {
      var link = document.createElement('a');
      link.href = url;
      link.download = url;
      document.body.appendChild(link).click();
   }

   protected downloadByIframe(url: string) {
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
      document.body.appendChild(iframe);
   }
}
export = URL;
