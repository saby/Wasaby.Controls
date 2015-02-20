define('js!SBIS3.CORE.GroupCheckBox/design/DesignPlugin',
   [
      "js!SBIS3.CORE.GroupCheckBox"
   ],
   function(GroupCheckBox){

      $ws.proto.GroupCheckBox.prototype.getElements = function() {
         return this._options.elements;
      };

      function _addGettersAndSetters(elementObj, ind, self) {
         elementObj.id = ind;

         elementObj.setCaption = function(caption){
            elementObj.caption = caption;
            self._childControls[elementObj.id].setCaption(caption);
         };

         elementObj.setValue = function(value){
            elementObj.value = value;
            self._childControls[elementObj.id].setValue(value);
         };
      }

      function _onRemoveItemFunc(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            (this._childControls[indexes[i]]).destroy();
            this._childControls.splice(indexes[i], 1);
         }
         this.recalculateIds();
         this._resizeFlags();
         this._updateResizer();
      }

      function _onInsertItemFunc(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            items[i] = items[i] || {};
            items[i].caption = 'Заголовок флага';
            items[i].name ='Флаг ' + indexes[i];
            _addGettersAndSetters(items[i], indexes[i], this);
         }
         this._redraw();
         this.recalculateElementIds();
         this._updateResizer();
      }

      function _onMoveItemFunc(event, indexFrom, indexTo) {
         var ctr = this._childControls.splice(indexFrom, 1);
         this._childControls.splice(indexTo, 0, ctr[0]);
         if(indexFrom < indexTo){
            this._container.find('div.ws-field-checkbox:eq('+indexTo+')').after(this._container.find('div.ws-field-checkbox:eq('+indexFrom+')'));
         } else {
            this._container.find('div.ws-field-checkbox:eq('+indexTo+')').before(this._container.find('div.ws-field-checkbox:eq('+indexFrom+')'));
         }
         this.recalculateIds();
         this._resizeFlags();
      }

      /**
       * @class $ws.proto.GroupCheckBox.DesignPlugin
       * @extends $ws.proto.GroupCheckBox
       * @plugin
       */
      $ws.proto.GroupCheckBox.DesignPlugin = GroupCheckBox.extendPlugin({
	      $constructor: function(){
		      var self = this;
            this._container.css('position','relative');
		      this._options.elements = $ws.helpers.collection(this._options.elements);
            for (var i = 0; i < this._options.elements.length; i++) {
               _addGettersAndSetters(this._options.elements[i], i, self);
            }

            this.getElements().subscribe("onRemoveItem", _onRemoveItemFunc.bind(self));
            this.getElements().subscribe("onInsertItem", _onInsertItemFunc.bind(self));
            this.getElements().subscribe("onMove", _onMoveItemFunc.bind(self));
	      },
         _initPositions: function() {
            var
               idx = 0;
            this._container.find('div.ws-field-checkbox').each(function(indx, element){
               var
                  div = $(element);
                  div.css('left','');
                  div.css('top','');
                  div.css('padding-left','');
             });
         },
         setWordWrap: function(wordWrap) {
            this._container.toggleClass('ws-prewrap', wordWrap);
            this._container.toggleClass('ws-nowrap', !wordWrap);
         },
         setUniform: function(uniform) {
            this._options.uniform = uniform;
            this._resizeFlags();
            this._updateResizer();
         },
         setColumnWidth: function(columnWidth) {
            this._options.columnWidth = columnWidth;
            this._resizeFlags();
            this._updateResizer();
         },
         setButtonDirection: function(buttonDirection) {
            this._options.buttonDirection = buttonDirection;
            this._initPositions();
            this._resizeFlags();
            this._updateResizer();
         },
         recalculateIds: function() {
            this._container.find('div.ws-field-checkbox').each(function(indx, element){
               var
                  id = $(element).attr('id'),
                  newid = id.substring(0, id.lastIndexOf('-') ) + '-' + indx;
               $(element).attr("id", newid);
            });
            this.recalculateElementIds();
         },
         recalculateElementIds: function() {
            var elements = this.getElements();
            for (var i = 0; i < elements.length; i++) {
               elements[i].id = i;
            }
         },
         _getResizerHeight: function() {
            var height = 0,
               action;
            if(this._options.buttonDirection =='inblock') {
               action = 'summ';
            } else {
               action = 'max';
            }
            height = this.getControlsSizez(action, 'height');
            return height;
         },
         _getResizerWidth: function() {
            var width = 0,
               action;
            if(this._options.buttonDirection =='inblock') {
               action = 'max';
            } else {
               action = 'summ';
            }
            width = this.getControlsSizez(action, 'width');
            return width;
         },
         getControlsSizez: function(act, dimension) {
            var size = 0,
                maxSize = 0,
                summSize = 0;
            this._container.find('div.ws-field-checkbox').each(function(indx, element){
               if(dimension === 'width') {
                  size = $(element).width();
               } else {
                  size = $(element).height();
               }
               if(act === 'max') {
                  if(size > maxSize) {
                     maxSize = size;
                  }
               } else {
                  summSize = summSize + size;
               }
            });
            if(act === 'summ') {
               size = summSize;
            } else {
               size = maxSize;
            }
            return size;
         }

      });
   });