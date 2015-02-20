define('js!SBIS3.CORE.Accordion/design/DesignPlugin',
   [
      "js!SBIS3.CORE.Accordion"
   ],
   function(Accordion){

      $ws.proto.Accordion.prototype.getElements = function() {
         return this._options.elements;
      };

      function _addGettersAndSetters(ElemObj, ind, self) {
         ElemObj.id  = ElemObj.id || ind;

         ElemObj.setId = function(id){
            self.setElementId(ElemObj.id, id);
            ElemObj.id =id;
         };

         ElemObj.setTitle = function(title){
            var element = self._elements[ElemObj.id],
                label = element.label;
            label.text(title);
         };

         ElemObj.setVisible = function(visible){
            if(visible) {
               self.showElement(ElemObj.id);
            } else {
               self.hideElement(ElemObj.id);
            }
         };

         ElemObj.setTemplate = function(template){
            var element = self._elements[ElemObj.id];
            element.template = template;
            element.area.children().empty();
            self._loadTemplate(ElemObj.id, undefined, true);
            self._calculateSize();
         };

         ElemObj.setImage = function(image){
            var element = self._elements[ElemObj.id],
               label = element.label,
               img = label.find('img.ws-accordion-element-img');
            if (img.length !== 0) {
               if(image === '') {
                  img.remove();
               } else {
                  img.attr('src', image);
               }
            } else {
               if( image !== '' ) {
                  img = $('<img src="' + $ws.helpers.processImagePath(image) +'" class="ws-accordion-element-img"/>');
                  label.prepend(img);
               }
            }
         }

      }

      function _onRemoveItemFunc(event, items, indexes) {
         for (var i = 0; i < items.length; i++) {
            this.removeElement(items[i].id);
         }
         this._calculateSize();
      }

      function _onInsertItemFunc(event, items, indexes) {
         var elementsCollection = this.getElements();
         for (var i = 0; i < items.length; i++) {
            items[i] = items[i] || {};

            // генерим ID для вкладки, если у неё ещё нет
            if (!items[i].id) {
               var elementId = 'acc-' + indexes[i];
               for (var j = 0; j < elementsCollection.length; j++) {
                  var curElementId = elementsCollection[j].id;
                  if (elementId === curElementId) {
                     elementId = $ws.helpers.randomId('acc-');
                     break;
                  }
               }
               items[i].id = elementId;
               items[i].title = 'Новая группа';
               items[i].visible = true;
            }

            var ElementObj = $ws.core.clone(items[i]);
            _addGettersAndSetters(items[i], indexes[i], this);

            this.addElement(ElementObj,indexes[i]);
         }
      }

		function _onMoveItemFunc(event, indexFrom, indexTo) {
			var idFrom = this.getGroupIdByIndex(indexFrom),
				idTo = this.getGroupIdByIndex(indexTo);
			if(indexFrom < indexTo) {
				this._elements[idFrom].wrapper.before(this._elements[idTo].wrapper);
			} else {
				this._elements[idTo].wrapper.before(this._elements[idFrom].wrapper);
			}
			this._elements[idFrom].position = indexTo;
			this._elements[idTo].position = indexFrom;
		}
      //endregion

   /**
    * @class $ws.proto.Accordion.DesignPlugin
    * @extends $ws.proto.Accordion
    * необходим для смены шаблонов в дизайн-тайме
    * @plugin
    */
   $ws.proto.Accordion.DesignPlugin = Accordion.extendPlugin({
      $constructor: function(){
         var self = this;

         this._options.elements = $ws.helpers.collection(this._options.elements);
         for (var i = 0; i < this._options.elements.length; i++) {
            if (!this._options.elements[i].id) {
               this._options.elements[i].id = i;
            }
            _addGettersAndSetters(this._options.elements[i], i, self);
         }

         this.getElements().subscribe("onInsertItem", _onInsertItemFunc.bind(self));
         this.getElements().subscribe("onRemoveItem", _onRemoveItemFunc.bind(self));
			this.getElements().subscribe("onMove", _onMoveItemFunc.bind(self));
      },

      setElementId: function(oldId, newId){
         var oldElement = this.getElement(oldId);
         oldElement.attr('data-acc-id', newId);
         this._elements[newId] = this._elements[oldId];
         delete this._elements[oldId];
         if(this._activeElement == oldId) {
            this._activeElement = newId;
         }
      },

      removeElement: function(id) {
         var removeWrapper = this._elements[id].wrapper;
         removeWrapper.empty().remove();
         delete this._elements[id];
         this.recalculatePosition();
      },

      getElement: function(id) {
         return this.getContainer().find('[data-acc-id="' + id + '"]');
      },

      addElement: function(spec, index) {
         var wrapper = $(this.makeElement(spec, index)),
             label = wrapper.find('span.ws-accordion-element-title'),
             area = wrapper.find('div.ws-accordion-element-area'),
             self = this;
            label.bind('click', function(e){
               var id = $(e.target).attr('data-acc-id');
               self._labelClickHandler(id);
            })
            .hover(this.hoverHandler),
            this.getContainer().append(wrapper);

         this._elements[spec.id] = {
            position: index,
            wrapper : wrapper,
            hidden : false,
            areaHidden: true,
            label : label,
            area : area,
            dReady : false,
            template : '',
            toolbarOpt : '',
            enabled : true
         };
         this.recalculatePosition();
      },

		getGroupIdByIndex: function(index) {
			for(var e in this._elements) {
				if(this._elements[e].position === index) {
					return e;
				}
			}
		},

      makeElement: function(spec, index) {
         return this._options.elementTemplate({ element: spec, index: index, hideActiveLabel: this._options.hideActiveLabel });
      },
      recalculatePosition: function() {
         var i = 0;
         for(var e in this._elements) {
				this._elements[e].position = i;
            i++;
         }
      }

   });
});