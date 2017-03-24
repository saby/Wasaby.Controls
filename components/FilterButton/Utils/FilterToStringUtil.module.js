/**
 * Created by am.gerasimov on 18.03.2016.
 */
define('js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
    [
       'js!SBIS3.CONTROLS.Utils.TemplateUtil',
       'Core/helpers/collection-helpers',
       'Core/helpers/date-helpers'
    ], function (TemplateUtil, colHelpers, dateHelpers) {

       function isEqualValues(val1, val2) {
          /* Даты нельзя сравнивать по обычному равенству (===) */
          if((val1 && val2) && (val1 instanceof Date || val2 instanceof Date)) {
             return dateHelpers.compareDates(new Date(val1), '=', new Date(val2));
          }
          return colHelpers.isEqualObject(val1, val2);
       }

       return {
          /**
           * Метод, который составляет строку из струкруты фильтров
           * @param structure Структура
           * @param templateField Поле элемента структуры фильтра, в котором лежит шаблон для отображения
           * @returns {String}
           */
          string: function (structure, templateField) {
             var template, templateRes, result;

             result = colHelpers.reduce(structure, function (res, elem) {
                template = TemplateUtil.prepareTemplate(elem[templateField]);

                if (template) {
                   templateRes = template(elem);
                   if (templateRes && templateRes.trim()) {
                      res.push(templateRes);
                   }
                   return res;
                } else if (template === null) {
                   return res;
                }

                /* Некорректно сравнивать elem.value и elem.resetValue, когда нет value,
                   поэтому считаем, что это значение по-умолчанию */
                if (elem.caption && elem.hasOwnProperty('value') && !isEqualValues(elem.value, elem.resetValue)) {
                   res.push(elem.caption);
                }
                return res;
             }, []);

             return result.join(', ');
          },

          isEqualValues: isEqualValues
       }
    });