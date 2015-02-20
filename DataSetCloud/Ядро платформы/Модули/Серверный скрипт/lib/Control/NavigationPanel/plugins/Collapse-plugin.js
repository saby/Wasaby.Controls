define('js!SBIS3.CORE.NavigationPanelCollapsePlugin', [ 'js!SBIS3.CORE.NavigationPanel', 'js!SBIS3.CORE.CollapsingNavigation' ],
      function (NavigationPanel, CollapsingNavigation) {

         'use strict';

         $ws.proto.NavigationPanel.CollapsePlugin = NavigationPanel.extendPlugin($.extend({}, CollapsingNavigation, {
            _initCollapsingNavigation: function () {
               var data = $ws.helpers.map(this._roots, function (value) {
                  return {
                     id: value,
                     title: this._recordSet.getRecordByPrimaryKey(value).get(this._options.altTreeNameFld)
                  };
               }, this);
               CollapsingNavigation._initCollapsingNavigation.call(this, data);
            },
            _getActiveLabelId: function () {
               var
                     activeRecord = this.getActiveRecord(),
                     pKey;
               while ((pKey = activeRecord.getParentKey())) {
                  activeRecord = this._recordSet.getRecordByPrimaryKey(pKey);
               }
               return activeRecord.getKey();
            },
            _positioningMarker: function () {
               this._onReplaceMarkerHandler(this._getActiveLabelId());
            }
         }));
      });