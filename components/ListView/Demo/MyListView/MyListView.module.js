define('js!SBIS3.CONTROLS.Demo.MyListView',
    [
   "Core/core-functions",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.Demo.MyListView",
   "html!SBIS3.CONTROLS.Demo.MyListView/resources/ResultsTemplate",
   "css!SBIS3.CONTROLS.Demo.MyListView",
   "js!SBIS3.CONTROLS.ListView",
   "js!SBIS3.CONTROLS.TreeView"
], function( cFunctions,CompoundControl, dotTplFn, resultsTpl) {
   /**
    * SBIS3.CONTROLS.Demo.MyListView
    * @class SBIS3.CONTROLS.Demo.MyListView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyListView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            resultsTpl: resultsTpl
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var ListView = this.getChildControlByName('ListView');
         ListView._options.itemTemplate = 'Элемент списка';
         ListView.reload();
      },

       myOnActivatedHandlerD: function(){
           cFunctions.alert('Вы нажали кнопку DELETE');
       },
       myOnActivatedHandlerE: function(){
           cFunctions.alert('Вы нажали кнопку EDIT');
       }
   });
   return moduleClass;
});