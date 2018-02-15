/**
 * Created by am.gerasimov on 25.01.2016.
 */
define('SBIS3.CONTROLS/Suggest/SuggestShowAll',
    [  'Lib/Control/CompoundControl/CompoundControl',
       'tmpl!SBIS3.CONTROLS/Suggest/SuggestShowAll/SuggestShowAll',
       'SBIS3.CONTROLS/DataGridView',
       'i18n!SBIS3.CONTROLS/Suggest/SuggestShowAll',
       'css!SBIS3.CONTROLS/Suggest/SuggestShowAll/SuggestShowAll',
       'SBIS3.CONTROLS/Button'
    ], function (CompoundControl, dotTplFn) {

       var optionsToSet = ['columns', 'itemTpl', 'idProperty', 'filter', 'dataSource'];
       /**
        * @class SBIS3.CONTROLS/Suggest/SuggestShowAll
        * @extends Lib/Control/CompoundControl/CompoundControl
        * @public
        */
       var SuggestShowAllDialog = CompoundControl.extend(/** @lends SBIS3.CONTROLS/Suggest/SuggestShowAll.prototype */{
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
