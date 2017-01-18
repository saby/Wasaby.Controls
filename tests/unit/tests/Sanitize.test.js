/**
 * Created by ps.borisov on 25.11.2016.
 */
/**
 * Created by ps.borisov on 23.11.2016.
 */
/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.Utils.Sanitize'], function (Sanitize) {
   'use strict';
   describe('SBIS3.CONTROLS.Utils.Sanitize', function () {

      it('youtube iframe', function (){
         var
            text = '<html><iframe src="https://www.youtube.com/embed/HSzx-zryEgM"></iframe></html>';

         assert.equal(text, Sanitize(text));
      });

      it('remove script tag', function (){
         var
            text = '<script>alert(1)</script>',
            neededText = '';

         assert.equal(neededText, Sanitize(text));
      });

      it('save special symbols', function (){
         var
            text = '&nbsp; &iexcl; &cent; &pound; &curren; &yen; $brvbar; &sect; &uml; &copy;';

         assert.equal(text, Sanitize(text));
      });

      it('save new line symbol', function (){
         var
            text = 'test' + String.fromCodePoint(10) + 'test';

         assert.equal(text, Sanitize(text));
      });

      it('save new line symbol 2', function (){
         var
            text = 'test\ntest';

         assert.equal(text, Sanitize(text));
      });

      it('remove onclick', function (){
         var
            text = '<div onclick="alert(1);">123</div>',
            neededText = '<div>123</div>';

         assert.equal(neededText, Sanitize(text));
      });

      it('save style attr', function (){
         var
            text = '<div style="margin:20px">123</div>';
         assert.equal(text, Sanitize(text));
      });

      it('not valid attr (with javascript)', function (){
         var
            text = '<div styles="javasjavascjavascrjavascript:ipt:ript:cript:alert(1)">123</div>',
            neededText = '<div>123</div>';

         assert.equal(neededText, Sanitize(text));
      });

      it('iframe not valid src', function (){
         var
            text = '<html><iframe src="https://ya.ru/ara.js"></iframe></html>',
            neededText = '<html><iframe></iframe></html>';

         assert.equal(neededText, Sanitize(text));
      });

      it('iframe cut srcdoc', function (){
         var
            text = '<iframe srcdoc="<html> <body> <p>Серпантинная волна выстраивает октавер, благодаря широким мелодическим скачкам.</p>" src="nosrcdoc.html"></iframe>',
            neededText = '<iframe></iframe>';

         assert.equal(neededText, Sanitize(text));
      });
      
      it('data attributes', function (){
         var
            text = '<div data-raw="123" data-123="raw" data-alphanumberic0912="0912alphanumberic" data-really-long-123-numeric="sleep">sometext</div>';

         assert.equal(text, Sanitize(text));
      });
   });
});