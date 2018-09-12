/**
 * Created by kraynovdo on 01.11.2017.
 * @author Крайнов Д.О.
 */
define('Controls/List/Paging', [
   'Core/Control',
   'tmpl!Controls/List/Paging/Paging',
   'css!theme?Controls/List/Paging/Paging'
], function(BaseControl,
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
         } else {
            self._stateBegin = 'normal';
            self._statePrev = 'normal';
         }

         if (page >= config.pagesCount) {
            self._stateEnd = 'disabled';
            self._stateNext = 'disabled';
         } else {
            self._stateEnd = 'normal';
            self._stateNext = 'normal';
         }
      },
      changePage: function(self, page) {
         if (self._options.selectedPage !== page) {
            self._notify('selectedPageChanged', [page]);
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
         } else {
            _private.initArrowDefaultStates(this, newOptions);
         }
      },

      _beforeUpdate: function(newOptions) {
         if (newOptions.showDigits) {
            _private.initArrowStateBySelectedPage(this, newOptions.selectedPage, newOptions);
         } else {
            _private.initArrowDefaultStates(this, newOptions);
         }
      },

      __digitClick: function(e, digit) {
         _private.changePage(this, digit);
      },

      __arrowClick: function(e, btnName) {
         var targetPage;
         if (this['_state' + btnName] !== 'normal') {
            return;
         }
         if (this._options.showDigits) {
            switch (btnName) {
               case 'Begin': targetPage = 1; break;
               case 'End': targetPage = this._options.pagesCount; break;
               case 'Prev': targetPage = this._options.selectedPage - 1; break;
               case 'Next': targetPage = this._options.selectedPage + 1; break;
            }
            _private.changePage(this, targetPage);
         }
         this._notify('onArrowClick', btnName);
      }
   });

   //для тестов
   ModuleClass._private = _private;

   return ModuleClass;
});
