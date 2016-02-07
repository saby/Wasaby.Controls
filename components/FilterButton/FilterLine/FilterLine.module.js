define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.Utils.TemplateUtil',
      'html!SBIS3.CONTROLS.FilterButton.FilterLine'
   ],
   function(CompoundControl, TemplateUtil, dotTplFn) {

      /**
       * Контрол, отображающий строку из применённых фильтров рядом с кнопкой фильтров.
       * Умеет отображать строку по определенному шаблону. Работает исключительно через контекст.
       * @class SBIS3.CONTROLS.FilterButton.FilterLine
       * @extends $ws.proto.CompoundControl
       * @control
       * @public
       */

      var FilterLine = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $constructor: function() {
            var context = this.getLinkedContext(),
               self = this,
               updateContext = function() {
                  var linkText, textArr, template, templateRes;

                  /* Проверяем, изменился ли фильтр */
                  if (context.getValue('filterChanged')) {
                     /* Пробежимся по структуре фильтров и склеим строку */
                     textArr = $ws.helpers.reduce(context.getValue('filterStructure'), function(result, element) {
                        template = TemplateUtil.prepareTemplate(element.itemTemplate);

                        /* Если есть шаблон, строим строку по шаблону */
                        if(template) {
                           templateRes = template(element);
                           if(templateRes) {
                              result.push(template(element));
                           }
                           return result;
                        } else if(template === null) {
                           return result;
                        }

                        if (element.caption && !$ws.helpers.isEqualObject(element.value, element.resetValue)) {
                           result.push(element.caption);
                        }
                        return result;
                     }, []);
                     linkText = textArr.join(', ');
                  } else {
                     linkText = context.getValue('filterResetLinkText');
                  }

                  context.setValueSelf({
                     linkText: linkText,
                     titleText: $ws.helpers.escapeTagsFromStr(linkText, '')
                  });
                  self.toggle(!!linkText);
               };

            updateContext();
            context.subscribe('onFieldsChanged', updateContext);

            this._container.on('click', '.controls__filterButton__filterLine-cross', function() {
               this.sendCommand('reset-filter');
            }.bind(this));
         }
      });

      return FilterLine;
   }
);