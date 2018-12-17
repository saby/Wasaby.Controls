define(['wml!Controls/Container/Suggest/Layout/_SuggestListWrapper', 'wml!tests/Layout/Suggest/resources/template'],
   function(suggestListWrapperTpl, testTemplate) {
      'use strict';
      
      describe('Controls.Container.Suggest.Layout._SuggestListWrapper', function() {

         it('template test', function() {
            var withoutTabsSelectedKey = '<div ws-creates-context="true" ws-delegates-tabfocus="true" tabindex="0">tabsSelectedKey: test1</div>';
            var withSelectedKey = '<div ws-creates-context="true" ws-delegates-tabfocus="true" tabindex="0">tabsSelectedKey: test</div>';
            
            assert.equal(withoutTabsSelectedKey, suggestListWrapperTpl(
               {
                  _options: {
                     templateName: testTemplate,
                     templateOptions: {
                        tabsSelectedKey: 'test1'
                     },
                     tabsSelectedKey: null
                  }
               }
            ));
            assert.equal(withSelectedKey, suggestListWrapperTpl(
               {
                  _options: {
                     templateName: testTemplate,
                     templateOptions: {
                        tabsSelectedKey: 'test1'
                     },
                     tabsSelectedKey: 'test'
                  }
               }
            ));
         });
         
      });
   }
);