/// <amd-module name='File/Driver/URL' />
import detection = require('Core/detection');

class URL {
   constructor(private url: string) { }

   public save() {
      if (detection.isMobilePlatform) {
         window.open(this.url, '_self');
         return;
      }
      if (detection.firefox || detection.safari) {
         this.saveByIframe(this.url);
         return;
      }
      this.saveByA(this.url);
   }

   protected saveByA(url: string) {
      var link = document.createElement('a');
      link.href = url;
      link.download = url;
      document.body.appendChild(link).click();
   }

   protected saveByIframe(url: string) {
      var iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
      document.body.appendChild(iframe);
   }
}
export = URL;
