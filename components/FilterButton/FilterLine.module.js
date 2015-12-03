define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.CONTROLS.FilterButton.FilterLine'
   ],
   function(CompoundControl, dotTplFn) {

      /**
       * Метод, который переводит массивы и объекты в строку, чтобы их можно было сравнить
       * @param val
       * @returns {String}
       * @private
       */
      var _convertToComparison = function(val) {
         return val instanceof Array || val instanceof Object ? JSON.stringify(val) : val;
      };

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
                     var val = _convertToComparison(element.value),
                         resVal = _convertToComparison(element.resetValue);

                     if (element.caption && val !== resVal) {
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