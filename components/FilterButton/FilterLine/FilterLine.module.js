define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
      'html!SBIS3.CONTROLS.FilterButton.FilterLine',
      'Core/helpers/string-helpers'
   ],
   function(CompoundControl, FilterToStringUtil, dotTplFn, strHelpers) {

      /**
       * Контрол, отображающий строку из применённых фильтров рядом с кнопкой фильтров.
       * Умеет отображать строку по определенному шаблону. Работает исключительно через контекст.
       * @class SBIS3.CONTROLS.FilterButton.FilterLine
       * @extends $ws.proto.CompoundControl
       * @author Крайнов Дмитрий Олегович
       * @control
       * @public
       */

      var FilterLine = CompoundControl.extend({

         _dotTplFn: dotTplFn,

         $constructor: function() {
            var context = this.getLinkedContext(),
               self = this,
               updateContext = function() {
                  var linkText;

                  /* Проверяем, изменился ли фильтр */
                  if (context.getValue('filterChanged')) {
                     /* Пробежимся по структуре фильтров и склеим строку */
                     linkText = FilterToStringUtil.string(context.getValue('filterStructure'), 'itemTemplate');
                  } else {
                     linkText = context.getValue('filterResetLinkText');
                  }

                  context.setValueSelf({
                     linkText: linkText,
                     titleText: strHelpers.escapeTagsFromStr(linkText, '')
                  });
                  self.toggle(!!linkText);
                  self._notifyOnSizeChanged();
               };

            updateContext();
            context.subscribe('onFieldsChanged', updateContext);
            this._container.on('click', '.controls__filterButton__filterLine-cross', function() {
               if(self.isEnabled()) {
                  self.sendCommand('reset-filter', true);
               }
            });
         }
      });

      return FilterLine;
   }
);