define(['Controls/Button'], function (Button) {
   'use strict';

   var btn;

   describe('Controls.Button', function () {
      describe('private cssStyleGeneration', function () {
         beforeEach(function () {
            btn = new Button({
               style: 'buttonDefault'
            });
         });

         afterEach(function () {
            btn.destroy();
         });

         it('style linkMain',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'secondary' && fakeThis._viewMode === 'link');
         });

         it('style linkMain2',function () {
            var opt = {
               style: 'linkMain2',
               size: 'l'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkMain3',function () {
            var opt = {
               style: 'linkMain3',
               size: 'default'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional',function () {
            var opt = {
               style: 'linkAdditional',
               size: 's'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional2',function () {
            var opt = {
               style: 'linkAdditional2',
               size: 'xl'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'default' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional3',function () {
            var opt = {
               style: 'linkAdditional3',
               size: 'xl'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'danger' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional4',function () {
            var opt = {
               style: 'linkAdditional4',
               size: 'xl'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'success' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional5',function () {
            var opt = {
               style: 'linkAdditional5',
               size: 'xl'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'magic' && fakeThis._viewMode === 'link');
         });

         it('style buttonPrimary',function () {
            var opt = {
               style: 'buttonPrimary',
               size: 'default'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'primary' && fakeThis._viewMode === 'button');
         });

         it('style buttonDefault',function () {
            var opt = {
               style: 'buttonDefault',
               size: 'big'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'secondary' && fakeThis._viewMode === 'button');
         });

         it('style buttonAdd',function () {
            var opt = {
               style: 'buttonAdd',
               size: 'default'
            };
            var fakeThis = {};
            Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._style === 'primary' && fakeThis._viewMode === 'button');
         });
      });
      describe('constructor() and _beforeUpdate()', function() {
         var optionsCorrect = false;
         function redefinitionCssStyleGeneration() {
            var original = Button.prototype.cssStyleGeneration;
            Button.prototype.cssStyleGeneration = function(options) {
               if (options.style === 'test' && options.size === 'size') {
                  optionsCorrect = true;
               }
            };
            Button.prototype.cssStyleGeneration.original = original;
         }

         it('constructor', function() {
            redefinitionCssStyleGeneration();
            var opt = {
               style: 'test',
               size: 'size'
            };
            Button.prototype._beforeMount(opt);
            assert(optionsCorrect);
         });

         it('_beforeUpdate', function() {
            redefinitionCssStyleGeneration();
            var opt = {
               style: 'test',
               size: 'size'
            };
            Button.prototype._beforeUpdate(opt);
            assert(optionsCorrect);
         });

         afterEach(function () {
            Button.prototype.cssStyleGeneration = Button.prototype.cssStyleGeneration.original;
         });
      });
      describe('click', function () {
         var customEvent = {}, eventBublle = true;

         function initButton() {
            customEvent.stopPropagation = function () {
               eventBublle = false;
            };
            btn = new Button({
               style: 'buttonDefault'
            });
         }
         
         it('click to enabled button', function () {
            initButton();
            var opt = {
               readOnly: false
            };
            btn.saveOptions(opt);
            btn._clickHandler(customEvent);
            assert(eventBublle);
         });

         it('click to disabled button', function () {
            initButton();
            var opt = {
               readOnly: true
            };
            btn.saveOptions(opt);
            btn._clickHandler(customEvent);
            assert(!eventBublle);
         });
      });
   });
});
