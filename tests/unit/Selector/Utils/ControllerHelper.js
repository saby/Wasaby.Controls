define(['Controls/_lookup/ControllerHelper', 'Controls/_lookup/BaseController'], function(ControllerHelper, BaseController) {
   describe('Controls/_lookup/ControllerHelper', function() {
      it('showSelector', function() {
         var
            templateOptions,
            isShowSelector = false,
            baseController = new BaseController(),
            opener;

         baseController._options.selectorTemplate = {};
         baseController._children.selectorOpener = {
            open: function(config) {
               isShowSelector = true;
               templateOptions = config.templateOptions;
               opener = config.opener;
            }
         };

         ControllerHelper.showSelector(BaseController, {
            templateOptions: {
               selectedTab: 'Employees'
            }
         });

         assert.isTrue(isShowSelector);
         assert.equal(templateOptions.selectedTab, 'Employees');
         assert.equal(opener, selectedCollection);
      });
   });
});