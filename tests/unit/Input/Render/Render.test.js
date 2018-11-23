define(
   [
      'Controls/Input/Render',
      'tests/resources/TemplateUtil',
      'wml!tests/Input/Render/Content'
   ],
   function(Render, TemplateUtil, Content) {
      'use strict';

      describe('Controls.Input.Render', function() {
         var ctrl;

         beforeEach(function() {
            ctrl = new Render();
         });

         describe('Behavior', function() {
            describe('_getState', function() {
               it('Control in read mode.', function() {
                  ctrl._options.readOnly = true;

                  assert.equal(ctrl._getState(), '_readOnly');
               });
               it('Control in active mode.', function() {
                  ctrl._options.readOnly = false;
                  ctrl._active = true;

                  assert.equal(ctrl._getState(), '_active');
               });
               it('Control in inactive mode.', function() {
                  ctrl._options.readOnly = false;
                  ctrl._active = false;

                  assert.equal(ctrl._getState(), '');
               });
            });
         });
         describe('Template', function() {
            var template = TemplateUtil.clearTemplate(new Render({})._template);

            beforeEach(function() {
               ctrl._options = {
                  content: Content,
                  size: 'm',
                  fontStyle: 'default',
                  textAlign: 'left',
                  style: 'info'
               };
            });
            it('In the content template passed the placeholder template', function() {
               ctrl._options.placeholder = 'test placeholder';

               assert.equal(template(ctrl), '<div class="controls-Render controls-Render_style controls-Render_size_m controls-Render_style_info controls-Render_fontStyle_default controls-Render_fontStyle_default_size_m controls-Render_textAlign_left">' +
                                                '<div class="controls-Render__wrapper">' +
                                                   '<span class="controls-Render__baseline">&#65279;</span>' +
                                                   '<div class="controls-Render__field_textAlign_left">' +
                                                      '<div>testing the content</div>' +
                                                      '<div class="controls-Render__placeholder controls-Render__placeholder_overflow">test placeholder</div>' +
                                                   '</div>' +
                                                '</div>' +
                                             '</div>');
            });
         });
      });
   }
);
