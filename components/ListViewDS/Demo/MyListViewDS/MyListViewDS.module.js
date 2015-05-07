define('js!SBIS3.CONTROLSs.Demo.MyListViewDS',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLSs.Demo.MyListViewDS',
        'css!SBIS3.CONTROLSs.Demo.MyListViewDS',
        'js!SBIS3.CONTROLS.ListViewDS',
        'js!SBIS3.CONTROLS.TreeView'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyListViewDS
    * @class SBIS3.CONTROLSs.Demo.MyListViewDS
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyListViewDS.prototype */{
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
                           {{=it.get("title")}}\
                         </div>'
         ListView._options.itemTemplate = itemTpl;
         ListView.reload();
      },
      
      myOnActivatedHandler: function(item){
         alert('Вы нажали кнопку ' + item.title);
      }
   });
   return moduleClass;
});