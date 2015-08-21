define('js!SBIS3.CONTROLS.Demo.MyListView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyListView',
        'css!SBIS3.CONTROLS.Demo.MyListView',
        'js!SBIS3.CONTROLS.ListView',
        'js!SBIS3.CONTROLS.TreeView'
    ], function(CompoundControl, dotTplFn) {
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
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var ListView = this.getChildControlByName('ListView');
         var itemTpl = '<div class="listViewItem" style="height: 30px;">\
                           <span class="controls-ListView__itemCheckBox" ></span>\
                           {{=it.item.get("title")}}\
                         </div>'
         ListView._options.itemTemplate = itemTpl;
         ListView.reload();
      },

       myOnActivatedHandlerD: function(){
           $ws.core.alert('Вы нажали кнопку DELETE');
       },
       myOnActivatedHandlerE: function(){
           $ws.core.alert('Вы нажали кнопку EDIT');
       }
   });
   return moduleClass;
});