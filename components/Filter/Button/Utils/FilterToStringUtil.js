/**
 * Created by am.gerasimov on 18.03.2016.
 */
define('SBIS3.CONTROLS/Filter/Button/Utils/FilterToStringUtil',
    [
       'SBIS3.CONTROLS/Utils/TemplateUtil',
       'Core/helpers/Object/isEqual',
       'Core/helpers/Date/compareDates',
       'Core/helpers/String/escapeTagsFromStr'
    ], function (TemplateUtil, isEqualObject, compareDates, escapeTagsFromStr) {

       function isEqualValues(val1, val2) {
          /* Даты нельзя сравнивать по обычному равенству (===) */
          if((val1 && val2) && (val1 instanceof Date || val2 instanceof Date)) {
             return compareDates(new Date(val1), '=', new Date(val2));
          }
          return isEqualObject(val1, val2);
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

             result = Object.keys(structure).reduce(function(res, elem) {
                template = TemplateUtil.prepareTemplate(structure[elem][templateField]);

                if (template) {
                   templateRes = template(structure[elem]);
                   if (templateRes && templateRes.trim()) {
                      res.push(templateRes);
                   }
                   return res;
                } else if (template === null) {
                   return res;
                }

                /* Некорректно сравнивать elem.value и elem.resetValue, когда нет value,
                   поэтому считаем, что это значение по-умолчанию */
                if (structure[elem].caption && structure[elem].hasOwnProperty('value') && !isEqualValues(structure[elem].value, structure[elem].resetValue)) {
                   /* Вырезаем теги, если не задан пользовательский шаблон */
                   res.push(escapeTagsFromStr(structure[elem].caption, ''));
                }
                return res;
             }, []);

             return result.join(', ');
          },

          isEqualValues: isEqualValues
       }
    });
