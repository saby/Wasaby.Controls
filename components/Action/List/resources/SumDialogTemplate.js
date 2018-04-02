/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/Action/List/resources/SumDialogTemplate', [
   'Lib/Control/CompoundControl/CompoundControl',
   'tmpl!SBIS3.CONTROLS/Action/List/resources/SumDialogTemplate/SumDialogTemplate',
   'Core/defaultRenders',
   'SBIS3.CONTROLS/Button',
   'i18n!SBIS3.CONTROLS/Action/List/resources/SumDialogTemplate',
   'css!SBIS3.CONTROLS/Action/List/resources/SumDialogTemplate/SumDialogTemplate'
], function(Control, dotTplFn, defaultRenders) {

   var SumDialogTemplate = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            _defaultRenders: defaultRenders,
            name: 'controls-sumDialog',
            resizable: false,
            width: 'auto',
            title: rk("Суммирование"),
            fields: undefined,
            item: undefined
         }
      },

      _modifyOptions: function(options) {
         var title, model, format, type;
         SumDialogTemplate.superclass._modifyOptions.call(this, options);
         options._rows = [];
         model = options.item;
         format = model.getFormat();
         model.each(function(field, value) {
            title = options.fields[field] || field;
            type = format.at(format.getFieldIndex(field)).getType();
            type = type ? type.toLowerCase() : '';
            switch (type) {
               case "money":
                  value = options._defaultRenders.money(value);
                  break;
               case "integer":
                  value = options._defaultRenders.integer(value);
                  break;
            }
            options._rows.push({
               title: title,
               value: value
            });
         });

         return options;
      }
   });

   return SumDialogTemplate;
});