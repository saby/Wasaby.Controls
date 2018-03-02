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
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkMain3',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkAdditional',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkAdditional2',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkAdditional3',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkAdditional4',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style linkAdditional5',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style buttonPrimary',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style buttonDefault',function () {
            var opt = {
               style: 'linkMain',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });

         it('style buttonAdd',function () {
            var opt = {
               style: 'buttonAdd',
               size: 'xl'
            };
            Button._private.cssStyleGeneration(btn, opt);
            assert(btn._style === 'link-main' && btn._type === 'link' && btn._typeWithSize === 'link_size-xl');
         });
      });
   });
});