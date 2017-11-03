define('js!SBIS3.CONTROLS.FilterButton.FilterLine',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.FilterButton.FilterToStringUtil',
      'tmpl!SBIS3.CONTROLS.FilterButton.FilterLine',
      'Core/helpers/String/escapeTagsFromStr',
      'Core/Sanitize',
      'SBIS3.CONTROLS.Clickable'
   ],
   function(CompoundControl, FilterToStringUtil, dotTplFn, escapeTagsFromStr, Sanitize, Clickable) {

      /**
       * Контрол, отображающий строку из применённых фильтров рядом с кнопкой фильтров.
       * Умеет отображать строку по определенному шаблону. Работает исключительно через контекст.
       * @class SBIS3.CONTROLS.FilterButton.FilterLine
       * @extends SBIS3.CORE.CompoundControl
       * @author Крайнов Дмитрий Олегович
       * @control
       * @public
       */

      var FilterLine = CompoundControl.extend([Clickable], {

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

                  linkText = Sanitize(linkText, { validNodes: {component: true}, escapeInvalidTags: true });

                  context.setValueSelf({
                     linkText: linkText,
                     titleText: escapeTagsFromStr(linkText, '')
                  });
                  self.toggle(!!linkText);
                  self._notifyOnSizeChanged();
               };

            updateContext();
            context.subscribe('onFieldsChanged', updateContext);
         }
      });

      return FilterLine;
   }
);