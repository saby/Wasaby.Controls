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
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkMain2',function () {
            var opt = {
               style: 'linkMain2',
               size: 'l'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main2' && btn._type === 'link' && btn._typeWithSize === 'link_size-l');
         });

         it('style linkMain3',function () {
            var opt = {
               style: 'linkMain3',
               size: 'default'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main3' && btn._type === 'link' && btn._typeWithSize === 'link_size-default');
         });

         it('style linkAdditional',function () {
            var opt = {
               style: 'linkAdditional',
               size: 's'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-additional' && btn._type === 'link' && btn._typeWithSize === 'link_size-s');
         });

         it('style linkAdditional2',function () {
            var opt = {
               style: 'linkAdditional2',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-additional2' && btn._type === 'link');
         });

         it('style linkAdditional3',function () {
            var opt = {
               style: 'linkAdditional3',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-additional3' && btn._type === 'link');
         });

         it('style linkAdditional4',function () {
            var opt = {
               style: 'linkAdditional4',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-additional4' && btn._type === 'link');
         });

         it('style linkAdditional5',function () {
            var opt = {
               style: 'linkAdditional5',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-additional5' && btn._type === 'link');
         });

         it('style buttonPrimary',function () {
            var opt = {
               style: 'buttonPrimary',
               size: 'default'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'primary' && btn._type === 'button');
         });

         it('style buttonDefault',function () {
            var opt = {
               style: 'buttonDefault',
               size: 'big'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'default' && btn._type === 'button' && btn._typeWithSize === 'button_size-big');
         });

         it('style buttonAdd',function () {
            var opt = {
               style: 'buttonAdd',
               size: 'default'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'primary-add' && btn._type === 'button' && btn._typeWithSize === 'button_size-default');
         });

         it('uncorrect style',function () {
            var opt = {
               style: 'test',
               size: 'big'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'default' && btn._type === 'button' && btn._typeWithSize === 'button_size-big');
         });
      });
      describe('constructor() and _beforeUpdate()', function() {
         var optionsCorrect = false;
         function redefinitionCssStyleGeneration() {
            Button._private.cssStyleGeneration = function(self, options) {
               if (options.style === 'test' && options.size === 'size') {
                  optionsCorrect = true;
               }
            };
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
      });
      describe('click', function () {
         var customEvent = {}, eventBublle = true;
         beforeEach(function () {
            customEvent.stopPropagation = function () {
               eventBublle = false;
            };
            btn = new Button({
               style: 'buttonDefault'
            });
         });
         
         it('click to enabled button', function () {
            var opt = {
               readOnly: false
            };
            btn.saveOptions(opt);
            btn._clickHandler(customEvent);
            assert(eventBublle);
         });

         it('click to disabled button', function () {
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
