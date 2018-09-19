define(
   [
      'Controls/StickyHeader',
      'Controls/StickyHeader/Context',
      'tests/unit/resources/TemplateUtil'
   ],
   function(StickyHeader, Context, TemplateUtil) {

      'use strict';

      describe('Controls.StickyHeader.Template', function() {
         var ctrl = new StickyHeader({});
         var template = TemplateUtil.clearTemplate(ctrl._template);
         var inst;

         beforeEach(function() {
            inst = {
               _context: {
                  stickyHeader: new Context({shadowVisible: false})
               },
               _options: {},
               _model: {}
            };
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
   }
);
