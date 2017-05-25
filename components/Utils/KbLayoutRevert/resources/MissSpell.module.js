/**
 * Created by am.gerasimov on 13.02.2017.
 */
define('js!SBIS3.CONTROLS.MissSpell',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.CONTROLS.MissSpell',
      'css!SBIS3.CONTROLS.MissSpell',
      'js!SBIS3.CONTROLS.Link'
   ],
   function(CompoundControl, tmpl){
      
      'use strict';
      
      return CompoundControl.extend({
         _dotTplFn: tmpl,
         $constructor: function() {
            var self = this;
            
            this._publish('onActivated');
            
            this.subscribe('onInit', function() {
               this.subscribeTo(this.getChildControlByName('missSpellLink'), 'onActivated', function() {
                  self._notify('onActivated', this.getCaption());
               })
            });
            
         },
         
         setCaption: function(caption) {
            this.getChildControlByName('missSpellLink').setCaption(caption);
         }
      });
   });