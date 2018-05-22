define('SBIS3.CONTROLS/Filter/HistoryView',
    [
       'SBIS3.CONTROLS/ListView',
       'tmpl!SBIS3.CONTROLS/Filter/HistoryView/footerTpl',
       'tmpl!SBIS3.CONTROLS/Filter/HistoryView/itemTpl',
       'SBIS3.CONTROLS/History/HistoryList',
       'Core/CommandDispatcher',
       'SBIS3.CONTROLS/Commands/CommandsSeparator',
       'css!SBIS3.CONTROLS/Filter/HistoryView/HistoryView'
    ],

    function(ListView, footerTpl, itemTpl, HistoryList, CommandDispatcher) {

       'use strict';
        /**
         *
         * @class SBIS3.CONTROLS/Filter/HistoryView
         * @extends SBIS3.CONTROLS/ListView
         */
       var FilterHistoryView = ListView.extend(/** @lends SBIS3.CONTROLS/Filter/HistoryView.prototype*/{
          $protected: {
             _options: {
                historyId: '',
                itemsActions: [],
                itemsDragNDrop: false,
                itemContentTpl: itemTpl,
                idProperty: 'id',
                useToggle: false
             }
          },

          $constructor: function() {
             this.subscribe('onDrawItems', function() {
                if (this._options.useToggle) {
                   this.getChildControlByName('toggle').toggle(Boolean(this.getItems().getCount() > 5));
                }
             });

             CommandDispatcher.declareCommand(this, 'toggle', function() {
                this.getContainer().toggleClass('controls-HistoryView__expanded');
             })
          },

          _modifyOptions: function() {
             var opts = FilterHistoryView.superclass._modifyOptions.apply(this, arguments);
             opts.cssClassName += ' controls-HistoryView';
             opts.footerTpl = opts.useToggle ? footerTpl : null;
             return opts;
          },

          init: function() {
             FilterHistoryView.superclass.init.apply(this, arguments);

             if(this._options.historyId) {
                var historyController = new HistoryList({historyId: this.getProperty('historyId')}),
                    self = this;
   
                self.subscribeTo(historyController, 'onHistoryUpdate', function(event, history) {
                   self.setItems(history.clone());
                });
   
                historyController.getHistory(true).addCallback(function(history) {
                   self.setItems(history.clone());
                   return history;
                });
                
                this.once('onDestroy', function() {
                   historyController.destroy();
                });
             }
          }
       });

       return FilterHistoryView;
    });