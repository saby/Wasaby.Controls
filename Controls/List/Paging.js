/**
 * Created by kraynovdo on 01.11.2017.
 */
define('js!Controls/List/Paging', [
   'Core/Control',
   'tmpl!Controls/List/Paging/Paging',
   'css!Controls/List/Paging/Paging'
], function (BaseControl,
             template
   ) {
   'use strict';
   var _private, ModuleClass;

   _private = {
      initArrowDefaultStates: function(self, config) {
         self._stateBegin = config.stateBegin || 'disabled';
         self._stateEnd = config.stateEnd || 'disabled';
         self._stateNext = config.stateNext || 'disabled';
         self._statePrev = config.statePrev || 'disabled';
      },

      initArrowStateBySelectedPage: function(self, page, config) {
         if (page <= 1) {
            self._stateBegin = 'disabled';
            self._statePrev = 'disabled';
         }
         else {
            self._stateBegin = 'normal';
            self._statePrev = 'normal';
         }

         if (page >= config.pagesCount) {
            self._stateEnd = 'disabled';
            self._stateNext = 'disabled';
         }
         else {
            self._stateEnd = 'normal';
            self._stateNext = 'normal';
         }
      }
   };

   ModuleClass = BaseControl.extend({
      _template: template,
      _stateBegin: 'normal',
      _stateEnd: 'normal',
      _stateNext: 'normal',
      _statePrev: 'normal',

      _beforeMount: function(newOptions) {
         if (newOptions.showDigits) {
            _private.initArrowStateBySelectedPage(this, newOptions.selectedPage, newOptions);
         }
         else {
            _private.initArrowDefaultStates(this, newOptions);
         }
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.showDigits) {
            _private.initArrowStateBySelectedPage(this, newOptions.selectedPage, newOptions);
         }
         else {
            _private.initArrowDefaultStates(this, newOptions);
         }
      },

      __digitClick: function(e, digit) {
         this.__changePage(digit);
      },

      __changePage: function(page) {
         if (this._options.selectedPage !== page) {
            this._notify('onChangeSelectedPage', page);
         }
      },

      __arrowClick: function(e, btnName) {
         if(this['_state' + btnName] !== 'normal') {
            return;
         }
         if (this._options.showDigits) {
            var targetPage;
            switch (btnName) {
               case 'Begin': targetPage = 1; break;
               case 'End': targetPage = this._options.pagesCount; break;
               case 'Prev': targetPage = this._options.selectedPage - 1; break;
               case 'Next': targetPage = this._options.selectedPage + 1; break;
            }
            this.__changePage(targetPage);
         }
         this._notify('onArrowClick', btnName);
      }
   });
   return ModuleClass;
});