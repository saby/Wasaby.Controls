/**
 * Created by am.gerasimov on 25.01.2016.
 */
define('js!SBIS3.CONTROLS.SuggestShowAll',
    [  'js!SBIS3.CORE.CompoundControl',
       'tmpl!SBIS3.CONTROLS.SuggestShowAll',
       'js!SBIS3.CONTROLS.DataGridView',
       'i18n!SBIS3.CONTROLS.SuggestShowAll',
       'js!SBIS3.CONTROLS.Button'
    ], function (CompoundControl, dotTplFn) {

       var optionsToSet = ['columns', 'itemTpl', 'idProperty', 'filter', 'dataSource'];
       /**
        * SBIS3.CORE.SuggestShowAll
        * @extends SBIS3.CORE.CompoundControl
        */
       var SuggestShowAllDialog = CompoundControl.extend({
          _dotTplFn: dotTplFn,
          $protected: {
             _options: {
                autoWidth: false,
                autoHeight: false,
                width: '700px',
                height: '500px',
                itemsDragNDrop: 'allow'
             }
          },
          $constructor: function () {
             var window = this.getParent();
             window._options.resizable = false;
             window._options.caption = rk('Все записи');
          },

          _modifyOptions: function (opts) {
             var options = SuggestShowAllDialog.superclass._modifyOptions.call(this, opts);

             if(options.chooserMode === 'floatArea') {
                options.autoHeight = true;
             }

             return options;
          },

          init: function() {
             SuggestShowAllDialog.superclass.init.apply(this, arguments);

             var view = this.getChildControlByName('controls-showAllView'),
                 selectButton = this.getChildControlByName('selectButton'),
                 self = this;

             optionsToSet.forEach(function(opt) {
                view.setProperty(opt, self._options.listConfig[opt]);
             });

             this.subscribeTo(view, 'onSelectedItemsChange', function () {
                selectButton.show();
             }.bind(this));

             selectButton.subscribe('onActivated', function () {
                this.sendCommand('close', view.getSelectedItems().toArray());
             });

          }
       });
       return SuggestShowAllDialog;
    });
