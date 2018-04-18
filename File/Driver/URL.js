define("File/Driver/URL", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    var URL = /** @class */ (function () {
        function URL(url) {
            this.url = url;
        }
        URL.prototype.save = function () {
            if (detection.isMobilePlatform) {
                window.open(this.url, '_self');
                return;
            }
            if (detection.firefox || detection.safari) {
                this.saveByIframe(this.url);
                return;
            }
            this.saveByA(this.url);
        };
        URL.prototype.saveByA = function (url) {
            var link = document.createElement('a');
            link.href = url;
            link.download = url;
            document.body.appendChild(link).click();
        };
        URL.prototype.saveByIframe = function (url) {
            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
            document.body.appendChild(iframe);
        };
        return URL;
    }());
    return URL;
});
