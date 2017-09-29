define([
   'js!SBIS3.CONTROLS.RichTextArea'
], function (
   RichTextArea
) {
   'use strict';

   describe('SBIS3.CONTROLS.RichTextArea', function () {

      describe('methods', function(){


         it('RichTextArea._sanitizeClasses', function () {
            var
               quest = '<div ' +
                  'class="engine-OnlineBaseInnerMinCoreView__sideLeft titleText controls-ScrollContainer__light" ' +
                  'style="margin: 0px; padding: 0px; outline: none; display: flex; flex-direction: column; height: 950px; width: 200px; flex-shrink: 0; background-color: rgb(44, 62, 80);">' +
                  '<div ' +
                  'class="controls-ScrollContainer ws-scrolling-content image-template-left controls-ScrollContainer__flex ws-control-inactive" ' +
                  'hasmarkup="true" ' +
                  'data-component="SBIS3.CONTROLS.ScrollContainer" ' +
                  'newconfig="cfg-tkp57c8383ahsemi1501664555797">' +
                  'kek</div></div>',
               answ = '<div ' +
                  'class="titleText" ' +
                  'style="margin: 0px; padding: 0px; outline: none; display: flex; flex-direction: column; height: 950px; width: 200px; flex-shrink: 0; background-color: rgb(44, 62, 80);">' +
                  '<div ' +
                  'class="image-template-left" hasmarkup="true">' +
                  'kek</div></div>';
            assert.equal(answ, RichTextArea.prototype._sanitizeClasses(quest));
         });
      });

   });


});
