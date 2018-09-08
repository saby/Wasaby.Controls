define(['Controls/Application/CssResolver'], function (CssResolver) {
   'use strict';

   describe('Controls/Application/CssResolver', function () {
      it('1', function () {
         var appRoot = '';
         var resourceRoot = '';
         var buildnumber = '';
         var isDebug = false;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button');
         assert.equal(res, '/Controls/Button.min.css');
      });
      it('2', function () {
         var appRoot = '/';
         var resourceRoot = '';
         var buildnumber = '';
         var isDebug = false;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button');
         assert.equal(res, '/Controls/Button.min.css');
      });
      it('3', function () {
         var appRoot = '/';
         var resourceRoot = 'resources';
         var buildnumber = '1234';
         var isDebug = false;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button');
         assert.equal(res, '/resources/Controls/Button.min.v1234.css');
      });
      it('4', function () {
         var appRoot = '/consultant/';
         var resourceRoot = '';
         var buildnumber = '123123123';
         var isDebug = true;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button');
         assert.equal(res, '/consultant/Controls/Button.css');
      });
      it('5', function () {
         var appRoot = '/consultant/';
         var resourceRoot = '/resources/';
         var buildnumber = '123123123';
         var isDebug = true;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button');
         assert.equal(res, '/consultant/resources/Controls/Button.css');
      });
      it('6', function () {
         var appRoot = '/consultant/';
         var resourceRoot = '/resources/';
         var buildnumber = '123123123';
         var isDebug = true;
         var theme = undefined;
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button', theme);
         assert.equal(res, '/consultant/resources/Controls/Button.css');
      });
      it('7', function () {
         var appRoot = '/consultant/';
         var resourceRoot = '/resources/';
         var buildnumber = '123123123';
         var isDebug = true;
         var theme = 'online';
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button', theme);
         assert.equal(res, '/consultant/resources/Controls/Button_online.css');
      });
      it('8', function () {
         var appRoot = '/consultant/';
         var resourceRoot = '/resources/';
         var buildnumber = '123';
         var isDebug = false;
         var theme = 'online';
         var rl = new CssResolver(isDebug, buildnumber, appRoot, resourceRoot);
         var res = rl.resolveCssLink('Controls/Button', theme);
         assert.equal(res, '/consultant/resources/Controls/Button_online.min.v123.css');
      });
   });
});
