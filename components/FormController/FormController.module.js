define('js!SBIS3.CONTROLS.FormController', ['js!SBIS3.CORE.CompoundControl'], 
   function(CompoundControl, dotTpl) {
   /**
    * 
    */
   'use strict';

   var FormController = CompoundControl.extend([], {
      _dotTplFn: dotTpl,
      $protected: {
         _record: null,
         _options: {
            dataSource: null,
            key: null,
            record: null
         }
      },
      
      $constructor: function() {
         this._publish('onSubmit');
         $ws.single.CommandDispatcher.declareCommand(this, 'submit', this.submit);
         if (this._options.dataSource){
            this._runQuery();
         } else {
            this._setContextRecord(this._options.record);
         }
      },

      submit: function(){
         var self = this;
         this._options.dataSource.update(this._options.record).addCallback(function(){
            self.getTopParent().ok();
         });
      },

      _readRecord: function(key){
         return this._options.dataSource.read(key);
      },

      _setContextRecord: function(record){
         this.getLinkedContext().setValue('record', record);               
      },

      setDataSource: function(source){
         this._options.dataSource = source;
         this._runQuery();
      },

      setRecord: function(record){
         this._options.record = record;
         this._setContextRecord(record);
      },

      _runQuery: function() {
         var self = this,
            hdl;
         if (this._options.key) {
            hdl = this._readRecord(this._options.key);
         }
         else {
            hdl = this._options.dataSource.create(); 
         }
         hdl.addCallback(function(record){
            self._options.record = record;
            self._setContextRecord(record);   
         });
         
      }
   });

   return FormController;

});