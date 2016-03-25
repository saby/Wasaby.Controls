/**
 * Created by am.gerasimov on 18.03.2016.
 */
define('js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
    [
       'js!SBIS3.CONTROLS.Utils.TemplateUtil'
    ], function (TemplateUtil) {

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

                if (elem.caption && !$ws.helpers.isEqualObject(elem.value, elem.resetValue)) {
                   res.push(elem.caption);
                }
                return res;
             }, []);

             return result.join(', ');
          }
       }
    });