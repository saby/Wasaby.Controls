/* global define, beforeEach, afterEach, describe, context, it, assert, $ws */
define(['js!SBIS3.CONTROLS.RichTextArea'], function (RichTextArea) {
   'use strict';
   describe('SBIS3.CONTROLS.RichTextArea', function () {
      it('_replaceSmilesToCode()', function () {
         var
            question = '😂😄😇😈😉😋😍😎😐😔😘😠😣😩😪😫😭😲😷🙈🙉🙊😊😃',
            answer ='&#128514;&#128516;&#128519;&#128520;&#128521;&#128523;&#128525;&#128526;&#128528;&#128532;&#128536;&#128544;&#128547;&#128553;&#128554;&#128555;&#128557;&#128562;&#128567;&#128584;&#128585;&#128586;&#128522;&#128515;';
         assert.strictEqual(RichTextArea.prototype._replaceSmilesToCode(question), answer);
      });
      it('_replaceCodesTosmile()', function () {
         var
            question = '&#128514;&#128516;&#128519;&#128520;&#128521;&#128523;&#128525;&#128526;&#128528;&#128532;&#128536;&#128544;&#128547;&#128553;&#128554;&#128555;&#128557;&#128562;&#128567;&#128584;&#128585;&#128586;&#128522;&#128515;',
            answer ='😂😄😇😈😉😋😍😎😐😔😘😠😣😩😪😫😭😲😷🙈🙉🙊😊😃';
         assert.strictEqual(RichTextArea.prototype._replaceCodesToSmile(question), answer);
      })
   })
});