define('Controls/Application/LinkResolver', ['Core/core-extend'], function(coreExtend) {
   'use strict';

   // css link should look like:
   // if it's release mode
   // /**appRoot**/**resourceRoot**/path/to/file.min.v**buildnumber**.css
   // and if it's debug mode
   // /**appRoot**/**resourceRoot**/path/to/file.css

   return coreExtend.extend([], {
      constructor: function(isDebug, buildNumber, appRoot, resourceRoot) {
         this.isDebug = isDebug;
         this.buildNumber = buildNumber || '';
         var fullResourcePath = '';
         if (appRoot) {
            fullResourcePath += '/' + appRoot + '/';
         }
         if (resourceRoot) {
            fullResourcePath += '/' + resourceRoot + '/';
         }
         this.resourceRoot = ('/' + fullResourcePath).replace(/[\/]+/g, '/');
      },
      getLinkWithResourceRoot: function(cssName) {
         return this.resourceRoot + cssName;
      },
      resolveLink: function(link, ext) {
         var res = link;
         res = this.getLinkWithResourceRoot(res);
         res = this.getLinkWithExt(res, ext);
         return res;
      },
      resolveCssWithTheme: function(link, ext, theme) {
         var res = link;
         res = this.getLinkWithResourceRoot(res);
         res = this.getLinkWithTheme(res, theme);
         res = this.getLinkWithExt(res, ext);
         return res;
      },
      getLinkWithTheme: function(cssName, theme) {
         if (!theme) {
            return cssName;
         }
         return cssName + '_' + theme;
      },
      getLinkWithExt: function(link, ext) {
         var res = link;
         if (this.isDebug) {
            res = link + '.' + ext;
         } else {
            if (!this.buildNumber) {
               res = link + '.min.' + ext;
            } else {
               res = link + '.min.v' + this.buildNumber + '.' + ext;
            }
         }
         return res;
      }
   });
});