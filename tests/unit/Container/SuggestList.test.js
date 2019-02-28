define(
   ['Controls/Container/Suggest/List'],
   function(List) {
      
      'use strict';
      
      describe('Controls.Container.Suggest.List', function() {
         
         it('_beforeUpdate', function() {
            var suggestList = new List();
            var contextObject = {
               suggestOptionsField: {
                  options: {
                     tabsSelectedKey: null
                  }
               }
            };
            var contextObjectWithNewKey = {
               suggestOptionsField: {
                  options: {
                     tabsSelectedKey: 'test'
                  }
               }
            };
            var eventFired = false;
            var tab = null;
   
            suggestList._suggestListOptions = {
               tabsSelectedKey: null
            };
            
            suggestList._notify = function(event, id) {
               eventFired = true;
               tab = id[0];
            };
   
            suggestList._beforeUpdate({}, contextObject);
            
            assert.isFalse(eventFired);
            assert.equal(tab, null);
   
            suggestList._beforeUpdate({}, contextObjectWithNewKey);
   
            assert.isTrue(eventFired);
            assert.equal(tab, 'test');
         });
         
         it('_tabsSelectedKeyChanged', function() {
            var suggestList = new List();
            var tab = null;
            suggestList._suggestListOptions = {
               tabsSelectedKeyChangedCallback: function(newtab) {
                  tab = newtab;
               }
            };
            
            suggestList._tabsSelectedKeyChanged(null, 'test');
            assert.equal(tab, 'test');
         });
   
         it('isTabChanged', function() {
            assert.isTrue(List._private.isTabChanged({tabsSelectedKey: 1}, 2));
            assert.isFalse(List._private.isTabChanged({tabsSelectedKey: 1}, 1));
         });

         it('dispatchEvent', function() {
            var eventDispatched = false;
            var container = {
               dispatchEvent: function(event) {
                  assert.equal(event.keyCode, 'testKeyCode');
                  eventDispatched = true;
               }
            }

            List._private.dispatchEvent(container, {keyCode: 'testKeyCode'}, {});
            assert.isTrue(eventDispatched);
         })

         it('getTabKeyFromContext', function() {
            var emptyContext = {};
            var contextWithValue = {
               suggestOptionsField: {
                  options: {
                     tabsSelectedKey: 1
                  }
               }
            };
      
            assert.equal(List._private.getTabKeyFromContext(emptyContext), null);
            assert.equal(List._private.getTabKeyFromContext(contextWithValue), 1);
         });
         
      });
   }
);