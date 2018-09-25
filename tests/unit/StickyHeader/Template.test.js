define(
   [
      'Controls/StickyHeader',
      'Controls/StickyHeader/Context',
      'tests/unit/resources/TemplateUtil',
      'Controls/StickyHeader/_StickyHeader'
   ],
   function(StickyHeader, Context, TemplateUtil, _StickyHeader) {

      'use strict';

      describe('Controls.StickyHeader.Template', function() {
         var ctrl, template, inst;

         beforeEach(function() {
            inst = {
               _context: {
                  stickyHeader: new Context({shadowVisible: false})
               },
               _options: {},
               _model: {}
            };
         });

         describe('StickyHeader', function() {
            beforeEach(function() {
               ctrl = new StickyHeader({});
               template = TemplateUtil.clearTemplate(ctrl._template);
            });

            it('The browser does not support sticky', function() {
               inst._isNotStickySupport = true;
               inst._options.content = TemplateUtil.content;

               assert.equal(template(inst),  '<div>testing the template</div>');
            });

            it('The browser does support sticky', function() {
               inst._isNotStickySupport = false;
               inst._options.content = TemplateUtil.content;

               assert.equal(template(inst),  '<div data-component="Controls/StickyHeader/_StickyHeader" class="controls-StickyHeader" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__content">testing the template</div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });
         });

         describe('_StickyHeader', function() {
            beforeEach(function() {
               ctrl = new _StickyHeader({});
               template = TemplateUtil.clearTemplate(ctrl._template);
            });

            it('On the desktop platform', function() {
               inst._isMobilePlatform = false;

               assert.equal(template(inst),  '<div class="controls-StickyHeader" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });

            it('On the mobile platform', function() {
               inst._isMobilePlatform = true;

               assert.equal(template(inst),  '<div class="controls-StickyHeader controls-StickyHeader_mobilePlatform" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });

            it('Move the header', function() {
               inst._context.stickyHeader.position = 10;

               assert.equal(template(inst),  '<div class="controls-StickyHeader" style="top: 10px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });

            it('Added content', function() {
               inst._options.content = TemplateUtil.content;

               assert.equal(template(inst),  '<div class="controls-StickyHeader" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__content">testing the template</div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });

            it('The header is fixed, but there should be no shadow', function() {
               inst._context.stickyHeader.shadowVisible = false;
               inst._model.shouldBeFixed = true;

               assert.equal(template(inst),  '<div class="controls-StickyHeader" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                             '</div>');
            });

            it('The header is fixed, the shadow should be', function() {
               inst._context.stickyHeader.shadowVisible = true;
               inst._model.shouldBeFixed = true;

               assert.equal(template(inst),  '<div class="controls-StickyHeader" style="top: 0px;">' +
                                                '<div class="controls-StickyHeader__observationTargetTop"></div>' +
                                                '<div class="controls-StickyHeader__observationTargetBottom"></div>' +
                                                '<div class="controls-Scroll__shadow controls-StickyHeader__shadow"></div>' +
                                             '</div>');
            });
         });
      });
   }
);
