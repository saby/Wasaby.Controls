define('Controls-demo/Popup/Compatible/TestActionParentLink/ChildPanel', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-demo/Popup/Compatible/TestActionParentLink/ChildPanel',
   'Env/Env'
], function(CompoundControl, dotTplFn, Env) {

   var ChildPanel = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      init: function() {
         var parentResult, childResult;

         ChildPanel.superclass.init.apply(this, arguments);

         parentResult = this._container.find('.parentLinkResult');
         childResult = this._container.find('.childLinkResult');

         try {
            this._runParentLinkTest(parentResult);
         } catch (e) {
            // Если эта проверка упадет, мы все равно хотим запустить
            // вторую, поэтому обработаем исключение
            Env.IoC.resolve('ILogger').error(
               'TestActionParentLink',
               'Не удалось проверить связь ребенка с родителем',
               e
            );
            parentResult.text('false');
         }

         try {
            this._runChildLinkTest(childResult);
         } catch (e) {
            Env.IoC.resolve('ILogger').error(
               'TestActionParentLink',
               'Не удалось проверить связь родителя с ребенком',
               e
            );
            childResult.text('false');
         }
      },
      _runParentLinkTest: function(resultContainer) {
         var
            panel = this.getParent(),
            panelParent = panel.getParent();

         resultContainer.text(panelParent._options.isActionParentButton === true);
      },
      _runChildLinkTest: function(resultContainer) {
         var
            parentButtonContainer = document.querySelector('.startActionButton'),
            parentButton = parentButtonContainer.wsControl,
            childButton = this.getChildControlByName('actionLinkChildButton'),
            hasChildLink = parentButton.getChildControlByName('actionLinkChildButton') === childButton;

         resultContainer.text(hasChildLink);
      }
   });

   return ChildPanel;

});
