/**
 * Created by as.suhoruchkin on 07.04.2015.
 */
define('js!SBIS3.CONTROLS.demoFilterViewArea', [
   'js!SBIS3.CONTROLS.FloatArea',
   'html!SBIS3.CONTROLS.demoFilterViewArea'
], function(FloatArea, dotTplFn) {

   var demoFilterViewArea = FloatArea.extend({

      $protected: {
         _dotTplFn: dotTplFn,

         _options: {
            corner: 'bl'
         }
      },
      $constructor: function() {
         this._bindEvents();
      },
      show: function() {
         demoFilterViewArea.superclass.show.apply(this, arguments);
      },
      _FilterYearActivated: function() {
         var userItems = [ {name: '1993', title: '1993'}, {name: '1994', title: '1994'}, {name: '1995', title: '1995'}, {name: '1996', title: '1996'}, {name: '1997', title: '1997'} ];
         this._addRecordToFilterView({ field: 'Год', componentType: 'SBIS3.CONTROLS.ComboBox', cfg: { items: userItems, caption: 'Год' } });
      },
      _MyActivated: function() {
         this._addRecordToFilterView({ field: 'НаМне', cfg: { textValue: 'На мне' }});
      },
      _FromMeActivated: function() {
         var userTpl = '<div class="userClass"><span style="margin-right: 15px;">{{=it.get("cfg").textValue}}</span><span style="color: red;">Это прикладной шаблон</span></div>';
         this._addRecordToFilterView({ field: 'ОтМеня', tpl: userTpl, cfg: { textValue: 'От меня' }});
      },
      _bindEvents: function() {
         this._container.find('.demo_template__opened').bind('click', this.hide.bind(this));
         this._container.find("[name='FilterYear']").bind('click', this._FilterYearActivated.bind(this));
         this._container.find("[name='My']").bind('click', this._MyActivated.bind(this));
         this._container.find("[name='fromMe']").bind('click', this._FromMeActivated.bind(this));
      },
      _addRecordToFilterView: function(record) {
         var self = this.getOpener();
         self._dataSource.create().addCallback(function (rec) {
            $.each(record, function(ind, val) {
               rec.set(ind, val);
            });
            self._dataSet._addRecords(rec);
            self._dataSource.sync(self._dataSet);
         });
         this.hide();
      }
   });

   return demoFilterViewArea;

});