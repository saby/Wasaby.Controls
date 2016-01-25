define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.Utils.TemplateUtil',
      'html!SBIS3.CONTROLS.FilterButton.FilterLine'
   ],
   function(CompoundControl, TemplateUtil, dotTplFn) {

      var FilterLine = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $constructor: function() {
            var
               ctx = this.getLinkedContext(),
               self = this;

            function updateContext() {
               var changed = ctx.getValue('filterChanged'),
                   filterStructure = ctx.getValue('filterStructure'),
                   resetLinkText = ctx.getValue('filterResetLinkText'),
                   linkText, textArr, template, templateRes;

               if (changed) {
                  textArr = $ws.helpers.reduce(filterStructure, function(result, element) {
                     template = TemplateUtil.prepareTemplate(element.itemTemplate);

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
                  linkText = resetLinkText;
               }

               ctx.setValueSelf('linkText', linkText);
               self.toggle(!!linkText);
            }

            updateContext();
            ctx.subscribe('onFieldsChanged', updateContext);

            var resetBtn = this._container.find('.controls__filterButton__filterLine-cross');
            resetBtn.bind('click', function() {
               this.sendCommand('reset-filter');
            }.bind(this));
         }
      });

      return FilterLine;
   }
);