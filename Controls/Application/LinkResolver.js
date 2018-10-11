define('Controls/Application/LinkResolver', ['Core/core-extend'], function(coreExtend) {
   'use strict';

   // css link should look like:
   // if it's release mode
   // /**appRoot**/**resourceRoot**/path/to/file.min.v**buildnumber**.css
   // and if it's debug mode
   // /**appRoot**/**resourceRoot**/path/to/file.css

   var LinkResolver = coreExtend.extend([], {
      constructor: function(isDebug, buildNumber, wsRoot, appRoot, resourceRoot) {
         this.isDebug = isDebug;
         this.wsRoot = wsRoot.replace(/\//g, '');
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
      resolveOldLink: function(name) {
         var res = require.toUrl(name);
         if (~res.indexOf(this.resourceRoot)) {
            res = res.split(this.resourceRoot)[1];
         }
         if (res.indexOf('/') === 0) {
            res = res.slice(1, res.length);
         }
         return res;
      },
      resolveLink: function(link, ext) {
         // var res = link;
         // res = this.resolveOldLink(res);
         // res = this.getLinkWithResourceRoot(res);
         // res = this.getLinkWithExt(res, ext);
         // return res;
         return require.toUrl(link + '.' + ext);
      },
      resolveCssWithTheme: function(link, theme) {
         // var res = link;
         // res = this.getLinkWithResourceRoot(res);
         // res = this.getLinkWithTheme(res, theme);
         // res = this.getLinkWithExt(res, 'css');
         // return res;
         return require.toUrl(link + '_' + theme + '.css');
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
         } else if (!this.buildNumber) {
            res = link + '.min.' + ext;
         } else {
            res = link + '.min.v' + this.buildNumber + '.' + ext;
         }
         return res;
      }
   });

   // LinkResolver.getInstance = function getInstance() {
   //    if (process && process.domain && process.domain.req) {
   //       if (!process.domain.req._$LinkResolver) {
   //          // Create instance on server
   //          process.domain.req._$LinkResolver = new LinkResolver();
   //       }
   //       return process.domain.req._$LinkResolver;
   //    }
   //    if (typeof window !== 'undefined') {
   //       if(!window._$LinkResolver) {
   //          // Create instance on client
   //          window._$LinkResolver = new LinkResolver();
   //       }
   //       return window._$LinkResolver;
   //    }
   //    IoC.resolve('ILogger').error('Cannot create link resolver');
   // }
   return LinkResolver;
});
