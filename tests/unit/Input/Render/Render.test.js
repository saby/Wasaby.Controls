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
                  ctrl._beforeMount({
                     readOnly: true,
                     multiline: false,
                     state: ''
                  });

                  assert.equal(ctrl._state, 'readonly');
               });
               it('Control in read mode and multiline.', function() {
                  ctrl._beforeMount({
                     readOnly: true,
                     multiline: true,
                     state: ''
                  });

                  assert.equal(ctrl._state, 'readonly-multiline');
               });
               it('Control in active mode.', function() {
                  ctrl._beforeMount({
                     state: '',
                     readOnly: false
                  });
                  ctrl._options = {
                     state: ''
                  };
                  ctrl._setContentActive(true);

                  if (Env.detection.isIE) {
                     assert.equal(ctrl._state, 'valid-active');
                  } else {
                     assert.equal(ctrl._state, 'valid');
                  }
               });
               it('Control in inactive mode.', function() {
                  ctrl._beforeMount({
                     readOnly: false,
                     state: ''
                  });

                  assert.equal(ctrl._state, 'valid');
               });
            });
         });
         describe('Template', function() {
            var template = TemplateUtil.clearTemplate(new input.Render({})._template);

            beforeEach(function() {
               ctrl._options = {
                  content: Content,
                  size: 'm',
                  state: '',
                  fontStyle: 'default',
                  textAlign: 'left',
                  style: 'info',
                  theme: 'default'
               };
               ctrl._beforeMount(ctrl._options);
            });
            it('In the content template passed the placeholder template', function() {
               ctrl._options.placeholder = 'test placeholder';

               assert.equal(template(ctrl), placeholderTest({}));
            });
         });
      });
   }
);
