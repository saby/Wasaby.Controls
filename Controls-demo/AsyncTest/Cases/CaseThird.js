define('Controls-demo/AsyncTest/Cases/CaseThird',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls-demo/AsyncTest/Cases/CaseThird',
      'css!Controls-demo/AsyncTest/Cases/CaseThird',
   ],
   function(Control, Env, template) {
      'use strict';

      var CaseThirdModule = Control.extend({
         _template: template,
         _isSearch: true,
         _isFilterWrapper: true,
         _isButton: true,
         _testState: [false, false, false, false],

         _setSearchState: function() {
            this._isSearch = !this._isSearch;
            this._forceUpdate();
         },

         _setFilterWrapperState: function() {
            this._isFilterWrapper = !this._isFilterWrapper;
            this._forceUpdate();
         },

         _setButtonState: function() {
            this._isButton = !this._isButton;
            this._forceUpdate();
         },
         _setTestState: function(event, index) {
            this._testState[index] = !this._testState[index];
            this._forceUpdate();
         },
      });


      return CaseThirdModule;
   }
);
