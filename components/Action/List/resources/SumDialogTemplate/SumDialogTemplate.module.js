/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.SumDialogTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.SumDialogTemplate',
   'Core/defaultRenders',
   'js!SBIS3.CONTROLS.Button',
   'i18n!SBIS3.CONTROLS.SumDialogTemplate',
   'css!SBIS3.CONTROLS.SumDialogTemplate'
], function(Control, dotTplFn, defaultRenders) {

   var SumDialogTemplate = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            _defaultRenders: defaultRenders,
            name: 'controls-sumDialog',
            resizable: false,
            width: 300,
            title: rk("Суммирование"),
            fields: undefined,
            item: undefined
         }
      },

      _modifyOptions: function(options) {
         var title, value, index, model, format, enumerator, field;
         SumDialogTemplate.superclass._modifyOptions.call(this, options);
         options._rows = [];
         model = options.item;
         format = model.getFormat();
         enumerator = model.getEnumerator();
         while (field = enumerator.getNext()) {
            title = options.fields[field] || field;
            index = format.getFieldIndex(field);
            type = format.at(index).getType();
            type = type ? type.toLowerCase() : '';
            value = model.get(field);
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
         }

         return options;
      }
   });

   return SumDialogTemplate;
});