/**
 * Created by am.gerasimov on 18.03.2016.
 */
define('js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
    [
       'js!SBIS3.CONTROLS.Utils.TemplateUtil'
    ], function (TemplateUtil) {

       function isEqualValues(val1, val2) {
          /* Даты нельзя сравнивать по обычному равенству (===) */
          if((val1 && val2) && (val1 instanceof Date || val2 instanceof Date)) {
             return $ws.helpers.compareDates(new Date(val1), '=', new Date(val2));
          }
          return $ws.helpers.isEqualObject(val1, val2);
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

             result = $ws.helpers.reduce(structure, function (res, elem) {
                template = TemplateUtil.prepareTemplate(elem[templateField]);

                if (template) {
                   templateRes = template(elem);
                   if (templateRes) {
                      res.push(template(elem));
                   }
                   return res;
                } else if (template === null) {
                   return res;
                }

                if (elem.caption && !isEqualValues(elem.value, elem.resetValue)) {
                   res.push(elem.caption);
                }
                return res;
             }, []);

             return result.join(', ');
          },

          isEqualValues: isEqualValues
       }
    });