define(
   [
      'Env/Env',
      'Controls/input',
      'unit/resources/TemplateUtil',
      'wml!unit/Input/Render/Content',
      'wml!unit/Input/Render/PlaceholderTest'
   ],
   function(Env, input, TemplateUtil, Content, placeholderTest) {
      'use strict';

      describe('Controls.Input.Render', function() {
         var ctrl;

         beforeEach(function() {
            ctrl = new input.Render();
         });

         describe('Behavior', function() {
            describe('_getState', function() {
               it('Control in read mode.', function() {
                  ctrl._options.readOnly = true;
                  ctrl._options.multiline = false;

                  assert.equal(ctrl._getState(false), '_readOnly');
               });
               it('Control in read mode and multiline.', function() {
                  ctrl._options.readOnly = true;
                  ctrl._options.multiline = true;

                  assert.equal(ctrl._getState(false), '_readOnly_multiline');
               });
               it('Control in active mode.', function() {
                  ctrl._options.readOnly = false;
                  if (Env.detection.isIE) {
                     assert.equal(ctrl._getState(true), '_active');
                  } else {
                     assert.equal(ctrl._getState(true), '');
                  }
               });
               it('Control in inactive mode.', function() {
                  ctrl._options.readOnly = false;

                  assert.equal(ctrl._getState(false), '');
               });
            });
         });
         describe('Template', function() {
            var template = TemplateUtil.clearTemplate(new input.Render({})._template);

            beforeEach(function() {
               ctrl._options = {
                  content: Content,
                  size: 'm',
                  fontStyle: 'default',
                  textAlign: 'left',
                  style: 'info',
                  theme: 'default'
               };
            });
            it('In the content template passed the placeholder template', function() {
               ctrl._options.placeholder = 'test placeholder';

               assert.equal(template(ctrl), placeholderTest({}));
            });
         });
      });
   }
);
