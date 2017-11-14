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
   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _stateBegin: 'normal',
         _stateEnd: 'normal',
         _stateNext: 'normal',
         _statePrev: 'normal',

         constructor: function(cfg) {
            ModuleClass.superclass.constructor.apply(this, arguments);
            this._stateBegin = cfg.stateBegin || 'disabled';
            this._stateEnd = cfg.stateEnd || 'disabled';
            this._stateNext = cfg.stateNext || 'disabled';
            this._statePrev = cfg.statePrev || 'disabled';
         },

         _beforeMount: function(newOptions) {
            this._selectedKey = newOptions.selectedKey;
            if (newOptions.showDigits) {
               this.__calcBtnStates(this._selectedKey);
            }
         },

         _beforeUpdate: function(newOptions) {
            if (this._options.selectedKey != newOptions.selectedKey) {
               this._selectedKey = newOptions.selectedKey;
               if (newOptions.showDigits) {
                  this.__calcBtnStates(this._selectedKey);
               }
            }
         },

         __calcBtnStates: function(selKey) {
            if (selKey <= 1) {
               this._stateBegin = 'disabled';
               this._statePrev = 'disabled';
            }
            else {
               this._stateBegin = 'normal';
               this._statePrev = 'normal';
            }

            if (selKey >= this._options.pagesCount) {
               this._stateEnd = 'disabled';
               this._stateNext = 'disabled';
            }
            else {
               this._stateEnd = 'normal';
               this._stateNext = 'normal';
            }
         },

         __digitClick: function(e, digit) {
            this.__changePage(digit);
         },

         __changePage: function(page) {
            if (this._selectedKey != page) {
               this._selectedKey = page;
               this.__calcBtnStates(this._selectedKey);
               this._notify('onSelectedKeyChange');
            }
         },

         __arrowClick: function(e, btnName) {
            if(this['_state' + btnName] == 'normal') {
               if (this._options.showDigits) {
                  var targetPage;
                  switch (btnName) {
                     case 'Begin': targetPage = 1; break;
                     case 'End': targetPage = this._options.pagesCount; break;
                     case 'Prev': targetPage = this._selectedKey - 1; break;
                     case 'Next': targetPage = this._selectedKey + 1; break;
                  }
                  this.__changePage(targetPage);
               }
               this._notify('on' + btnName + 'Click')
            }
         }
      });
   return ModuleClass;
});