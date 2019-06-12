define(['Controls/buttons'], function(buttons) {
   'use strict';

   var btn;

   describe('Controls.Button', function() {
      describe('private cssStyleGeneration', function() {
         beforeEach(function() {
            btn = new buttons.Button({
               style: 'buttonDefault'
            });
         });

         afterEach(function() {
            btn.destroy();
         });

         it('style linkMain', function() {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'secondary' && fakeThis._viewMode === 'link');
         });

         it('style linkMain2', function() {
            var opt = {
               style: 'linkMain2',
               size: 'l'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkMain3', function() {
            var opt = {
               style: 'linkMain3',
               size: 'default'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional', function() {
            var opt = {
               style: 'linkAdditional',
               size: 's'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'info' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional2', function() {
            var opt = {
               style: 'linkAdditional2',
               size: 'xl'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'default' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional3', function() {
            var opt = {
               style: 'linkAdditional3',
               size: 'xl'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'danger' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional4', function() {
            var opt = {
               style: 'linkAdditional4',
               size: 'xl'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'success' && fakeThis._viewMode === 'link');
         });

         it('style linkAdditional5', function() {
            var opt = {
               style: 'linkAdditional5',
               size: 'xl'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'magic' && fakeThis._viewMode === 'link');
         });

         it('style buttonPrimary', function() {
            var opt = {
               style: 'buttonPrimary',
               size: 'default'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'primary' && fakeThis._viewMode === 'button');
         });

         it('style buttonDefault', function() {
            var opt = {
               style: 'buttonDefault',
               size: 'big'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'secondary' && fakeThis._viewMode === 'button');
         });

         it('style buttonAdd', function() {
            var opt = {
               style: 'buttonAdd',
               size: 'default'
            };
            var fakeThis = {};
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._buttonStyle === 'primary' && fakeThis._viewMode === 'button');
         });
      });
      describe('private prepareIconSize', function() {
         beforeEach(function() {
            btn = new buttons.Button({
               style: 'buttonDefault'
            });
         });
         afterEach(function() {
            btn.destroy();
         });

         it('no IconSize', function() {
            var icon = 'icon-Admin icon-medium';
            var fakeThis = {};
            fakeThis._icon = buttons.Button.prototype.prepareIconSize.call(fakeThis, icon);
            assert(!fakeThis._iconSize && fakeThis._icon === 'icon-Admin icon-medium');
         });
         it('iconSize', function() {
            var opt = {
               icon: 'icon-Admin icon-medium',
               iconSize: 'large'
            };
            var regExp = new RegExp('\\bicon-(large|small|medium|default|16|24|32)\\b', 'g');
            var fakeThis = {
               _regExp: regExp,
               prepareIconSize: buttons.Button.prototype.prepareIconSize,
            };
            buttons.Button.prototype.cssStyleGeneration.call(fakeThis, opt);
            assert(fakeThis._iconSize === 'large');
            assert(fakeThis._icon === 'icon-Admin icon-medium');
         });
      });
      describe('constructor() and _beforeUpdate()', function() {
         var optionsCorrect = false;
         function redefinitionCssStyleGeneration() {
            var original = buttons.Button.prototype.cssStyleGeneration;
            buttons.Button.prototype.cssStyleGeneration = function(options) {
               if (options.style === 'test' && options.size === 'size') {
                  optionsCorrect = true;
               }
            };
            buttons.Button.prototype.cssStyleGeneration.original = original;
         }

         it('constructor', function() {
            redefinitionCssStyleGeneration();
            var opt = {
               style: 'test',
               size: 'size'
            };
            buttons.Button.prototype._beforeMount(opt);
            assert(optionsCorrect);
         });

         it('_beforeUpdate', function() {
            redefinitionCssStyleGeneration();
            var opt = {
               style: 'test',
               size: 'size'
            };
            buttons.Button.prototype._beforeUpdate(opt);
            assert(optionsCorrect);
         });

         afterEach(function() {
            buttons.Button.prototype.cssStyleGeneration = buttons.Button.prototype.cssStyleGeneration.original;
         });
      });
      describe('click', function() {
         var customEvent = {}, eventBublle = true;

         function initButton() {
            customEvent.stopPropagation = function() {
               eventBublle = false;
            };
            btn = new buttons.Button({
               style: 'buttonDefault'
            });
         }

         it('click to enabled button', function() {
            initButton();
            var opt = {
               readOnly: false
            };
            btn.saveOptions(opt);
            btn._clickHandler(customEvent);
            assert(eventBublle);
         });

         it('click to disabled button', function() {
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
