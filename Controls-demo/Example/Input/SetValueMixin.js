define('Controls-demo/Example/Input/SetValueMixin', [], function() {
   return {
      setValue: function(field, value) {
         this['_' + field + 'Value'] = value;
      }
   };
});
