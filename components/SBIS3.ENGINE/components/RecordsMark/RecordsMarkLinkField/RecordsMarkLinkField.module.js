define('js!SBIS3.CORE.RecordsMarkLinkField', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CORE.RecordsMarkLinkField',
   'css!SBIS3.CORE.RecordsMarkLinkField',
   'js!SBIS3.CORE.Button',
   'js!SBIS3.CORE.LinkButton',
   'js!SBIS3.CORE.FieldString'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CORE.RecordsMarkLinkField
    * @class SBIS3.CORE.RecordsMarkLinkField
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CORE.RecordsMarkLinkField.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            name: 'ColorMark',
            object: null
         }
      },
      $constructor: function() {
      },

      getValue: function(){
         return this._value;
      },

      getStringValue: function(){
         return this._stringValue;
      },

      setValue: function(value){
         if (value === '') {
            this._value = '';
            this._stringValue = '';
            this.getChildControlByName('ResetButton').hide();
            this._linkName.removeClass(this._linkName.data()['current-colorize-class']);
            this._linkName.text('Любая');
         }
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var area = this;
         if (!area._options.object){
            area._options.object = area.getTopParent().getOpener().getBrowser().getRecordsMarkOptions().object;
         }
         area._linkName = area.getContainer().find('.recordsMarkLinkField__VisualColorLink');
         this.getChildControlByName('LinkButton').subscribe('onActivated', function(){
            var pos = this.getContainer().offset();
            $ws.core.attachInstance('Control/Area:Dialog',{
               opener: area,
               template: 'js!SBIS3.ENGINE.RecordsMarkPlugin.DialogSelector',
               resizable: false,
               top: pos.top,
               left: pos.left,
               componentOptions: {
                  filterEdition: true
               }
            });
         });        
         this.getChildControlByName('ResetButton').subscribe('onActivated', function(){
            area.setValue('');
         });
      }
   });
   return moduleClass;
});