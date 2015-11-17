define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.FormController'], 
   function(CompoundControl, dotTpl) {
   /**
    * 
    */
   'use strict';

   var FormController = CompoundControl.extend([], {
      $protected: {
         _dotTplFn: dotTpl,
         _record: null,
         _options: {
            dataSource: null,
            id: null,
            record: null,
            content: null
         }
      },
      
      $constructor: function() {
         this._publish('onSubmit');
         var context = this.getContext(),
            self = this;

         if (this._options.dataSource){
            this._record = this._options.dataSource.read(this._options.id).addCallback(function(record){
               self._record = record;
               context.setValue('record', self._record);               
            });
         } else {
            this._record = this._options.record;
            context.setValue('record', this._record);
         }
      },

      submit: function(){

      },

      setDataSource: function(source){
         this._options.dataSource = source;
      },

      setRecord: function(record){
         this._options.record = record;
      }
   });

   return FormController;

});