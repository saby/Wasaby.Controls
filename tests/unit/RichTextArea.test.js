/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define([
   'SBIS3.CONTROLS/RichEditor/Components/RichTextArea',
   'SBIS3.CONTROLS/Utils/RichTextAreaUtil/RichTextAreaUtil'
], function (
   RichTextArea,
   RichTextAreaUtil
) {
   'use strict';
   describe('SBIS3.CONTROLS/RichEditor/Components/RichTextArea', function () {
      it('_replaceSmilesToCode()', function () {
         var
            question = '😂😄😵😈😉😋😍😎😐😔😘😠😣😩😪😫😭😲😷🙈🙉🙊😊😃',
            answer ='&#128514;&#128516;&#128565;&#128520;&#128521;&#128523;&#128525;&#128526;&#128528;&#128532;&#128536;&#128544;&#128547;&#128553;&#128554;&#128555;&#128557;&#128562;&#128567;&#128584;&#128585;&#128586;&#128522;&#128515;';
         assert.strictEqual(RichTextArea.prototype._replaceSmilesToCode(question), answer);
      });
      it('_replaceCodesTosmile()', function () {
         var
            question = '&#128514;&#128516;&#128565;&#128520;&#128521;&#128523;&#128525;&#128526;&#128528;&#128532;&#128536;&#128544;&#128547;&#128553;&#128554;&#128555;&#128557;&#128562;&#128567;&#128584;&#128585;&#128586;&#128522;&#128515;',
            answer ='😂😄😵😈😉😋😍😎😐😔😘😠😣😩😪😫😭😲😷🙈🙉🙊😊😃';
         assert.strictEqual(RichTextArea.prototype._replaceCodesToSmile(question), answer);
      })
   });
   describe('SBIS3.CONTROLS/Utils/RichTextAreaUtil/RichTextAreaUtil', function () {
      it('unDecorateLinks empty block', function () {
         var
            question = '<div class="LinkDecorator__wrap"></div>',
            answer ='';
         assert.strictEqual(RichTextAreaUtil.unDecorateLinks(question), answer);
      });
      it('unDecorateLinks block with image', function () {
         var
            question = '<div class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" target="_blank" href="href1"><img class="LinkDecorator__image" alt="href2" src="src1"/></a></div>',
            answer ='href2';
         assert.strictEqual(RichTextAreaUtil.unDecorateLinks(question), answer);
      });
      it('unDecorateLinks block without image', function () {
         var
            question = '<div class="LinkDecorator__wrap"><a class="LinkDecorator__linkWrap" target="_blank" href="href1"></a></div>',
            answer ='href1';
         assert.strictEqual(RichTextAreaUtil.unDecorateLinks(question), answer);
      });
   })
});