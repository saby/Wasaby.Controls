define("Controls-demo/PropertyGridNew/PropertyGrid",
   [
      "Core/Control",
      "wml!Controls-demo/PropertyGridNew/PropertyGrid",
      "css!Controls-demo/PropertyGridNew/PropertyGrid"
   ],
   function(Control, template) {
      "use strict";

      var PropertyGrid = Control.extend({
         _template: template,

         _beforeMount: function() {

            this._editingObject = {
               tileView: true,
               showBackgroundImage: true,
               siteUrl: "http://mysite.com",
               videoSource: "http://youtube.com/video",
            };

            this._source = [
               {
                  name: "tileView",
                  caption: "Список плиткой",
                  group: "boolean"
               },
               {
                  name: "showBackgroundImage",
                  caption: "Показывать изображение",
                  group: "boolean"

               },
               {
                  caption: "URL",
                  name: "siteUrl",
                  group: "string"
               },
               {
                  caption: "Источник видео",
                  name: "videoSource",
                  group: "string"
               },
            ];

            this._editingObjectString = JSON.stringify(this._editingObject, null, 4);
         },

         _editingObjectChanged: function(event, object) {
            this._editingObjectString = JSON.stringify(object, null, 4);
         },
      });

      return PropertyGrid;
   });
