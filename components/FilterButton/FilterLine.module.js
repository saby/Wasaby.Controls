define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.FilterButton.FilterLine'
   ],
   function(CompoundControl, dotTplFn) {

      var FilterLine = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         $constructor: function() {
            var
               ctx = this.getLinkedContext(),
               self = this;

            function updateContext() {
               var
                  changed = ctx.getValue('filterChanged'),
                  filterStructure = ctx.getValue('filterStructure'),
                  resetLinkText = ctx.getValue('filterResetLinkText'),
                  linkText, textArr;

               if (changed) {
                  textArr = $ws.helpers.reduce(filterStructure, function(result, element) {
                     var val = element.value,
                         resVal = element.resetValue;

                     if (element.caption && !$ws.helpers.isEqualObject(val, resVal)) {
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