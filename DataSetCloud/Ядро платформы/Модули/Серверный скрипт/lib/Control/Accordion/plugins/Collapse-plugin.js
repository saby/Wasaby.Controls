define('js!SBIS3.CORE.AccordionCollapsePlugin', [ 'js!SBIS3.CORE.Accordion', 'js!SBIS3.CORE.CollapsingNavigation' ],
      function (Accordion, CollapsingNavigation) {

         'use strict';

         $ws.proto.Accordion.CollapsePlugin = Accordion.extendPlugin($ws.core.merge({
            _initCollapsingNavigation: function () {
               var data = $ws.helpers.map(this._options.elements, function (value) {
                  return {
                     id: value.id,
                     title: value.title
                  };
               });
               CollapsingNavigation._initCollapsingNavigation.call(this, data);
            },
            _getActiveLabelId: function () {
               return this._activeElement;
            },
            _positioningMarker: function () {
               $ws.single.Marker.positionToElement(this.getLabelById(this._getActiveLabelId()));
            }
         }, CollapsingNavigation, {
            preferSource: true,
            clone: true
         }));
      });