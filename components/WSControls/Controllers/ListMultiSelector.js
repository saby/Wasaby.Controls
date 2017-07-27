define('js!WSControls/Controllers/ListMultiSelector',
   [
      'Core/Abstract',
      'js!WSControls/Lists/resources/utils/ItemsUtil'
   ],
   function(Abstract, ItemsUtil) {
      
      var _private = {
         /**
          * Проверяет на корректность переданные ключи
          * @param keys
          */
         checkSelectedKeys: function(keys) {
            if(!Array.isArray(keys)) {
               throw new Error('Argument must be instance of Array');
            }
         },
   
         /**
          * Выделеняет / снимает выделение в проекции
          * @param added[]
          * @param removed[]
          */
         selectInProjection: function(added, removed) {
            if(added.length || removed.length) {
               var projection = this._getOption('projection'),
                   self = this,
                   itemId;
      
               projection.each(function (projItem) {
                  itemId = ItemsUtil.getPropertyValue(projItem.getContents(), self._options.idProperty);
         
                  if (added.indexOf(itemId) !== -1) {
                     projItem.setSelected(true);
                  } else if (removed.indexOf(itemId) !== -1) {
                     projItem.setSelected(false);
                  }
               });
            }
         },
   

         select: function(newArray) {
            newArray = !this._options.multiSelect && newArray.length > 1? [newArray[0]] : newArray;
            
            var self = this,
                added = newArray.filter(function (elem) {
                   return self.selectedKeys.indexOf(elem) === -1;
                }),
                removed = self.selectedKeys.filter(function(elem) {
                   return newArray.indexOf(elem) === -1;
                });
            
            if(added.length || removed.length) {
               _private.selectInProjection.call(this, added, removed);
            }
   
            if (!this.allowEmptyMultiSelection && !newArray.length) {
               var projection = this._getOption('projection');
               
               if (projection.getCount()) {
                  newArray = [ItemsUtil.getPropertyValue(projection.at(0).getContents(), this._getOption('idProperty'))];
                  _private.selectInProjection.call(this, newArray, []);
               }
            }
            
            this.selectedKeys = newArray;
         }
      };
      
      var ListMultiSelector = Abstract.extend({
         _useNativeAsMain: true,
         
         constructor: function(cfg) {
            ListMultiSelector.superclass.constructor.call(this, cfg);
            
            this._options = {
               projection: cfg.projection,
               idProperty: cfg.idProperty,
               allowEmptyMultiSelection: cfg.allowEmptyMultiSelection,
               selectedKeys: cfg.selectedKeys,
               multiSelect: cfg.multiSelect
            };
            
            this.selectedKeys = cfg.selectedKeys || [];
            this.allowEmptyMultiSelection = cfg.allowEmptyMultiSelection !== false;
            this.multiSelect = cfg.multiSelect;
            
            _private.select.call(this, this.selectedKeys);
         },
         
         setSelectedKeys: function(keys) {
            _private.checkSelectedKeys(keys);
            _private.select.call(this, keys);
         },
         
         removeSelectedKeys: function(keys) {
            _private.checkSelectedKeys.call(this, keys);
            
            var selectedKeys = this.getSelectedKeys().slice(),
                index;
            
            keys.forEach(function(key) {
               index = selectedKeys.indexOf(key);
               
               if(index !== -1) {
                  selectedKeys.splice(index, 1);
               }
            });
   
            _private.select.call(this, selectedKeys);
         },
         
         addSelectedKeys: function(keys) {
            _private.checkSelectedKeys.call(this, keys);
   
            var selectedKeys = this.getSelectedKeys().slice();
   
            keys.forEach(function(key) {
               if(selectedKeys.indexOf(key) === -1) {
                  selectedKeys.push(key);
               }
            });
   
            _private.select.call(this, selectedKeys);
         },
         
         toggleSelectedKeys: function(keys) {
            _private.checkSelectedKeys.call(this, keys);
            
            var selectedKeys = this.getSelectedKeys().slice(),
                index;
   
            keys.forEach(function(key) {
               index = selectedKeys.indexOf(key);
               
               if(index === -1) {
                  selectedKeys.push(key);
               } else {
                  selectedKeys.splice(index, 1);
               }
            });
   
            _private.select.call(this, selectedKeys);
         },
         
         getSelectedKeys: function() {
            return this.selectedKeys;
         }
         
      });
      
      return ListMultiSelector;
   });