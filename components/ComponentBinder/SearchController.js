define('SBIS3.CONTROLS/ComponentBinder/SearchController',
    [
       'SBIS3.CONTROLS/Utils/KbLayoutRevert/KbLayoutRevertObserver',
       "Core/constants",
       'Core/core-clone',
       "Core/core-merge",
       "Core/Abstract",
       "Core/core-instance",
       'Core/helpers/Hcontrol/isElementVisible'
    ], function(KbLayoutRevertObserver, constants, coreClone, cMerge, cAbstract, cInstance, isElementVisible) {

   var SearchController = cAbstract.extend({
      $protected: {
         _options: {
            view: null,
            searchForm: null,
            searchFormWithSuggest: false,
            searchParamName: null,
            searchCrumbsTpl: null,
            searchMode: null,
            doNotRespondOnReset: null,
            breadCrumbs: null,
            backButton: null,
            keyboardLayoutRevert: true,
            hierarchyViewMode: true,
            keyboardLayoutRevertNew: false
         },
         _kbLayoutRevertObserver: null,
         _firstSearch: true,
         _searchReload: true,
         _searchMode: false,
         _searchForm: undefined,
         _lastRoot: undefined,
         _lastDepth: null
      },

      _breakSearch: function(withReload) {
         var searchForm = this._options.searchForm;
         this._searchReload = !!withReload;
         this._firstSearch = !!withReload;
         //Если в строке поиска что-то есть, очистим и сбросим Фильтр
         if (searchForm.getText()) {
            searchForm.resetSearch();
         }
      },

      /**
       * Scrolls to the top and reloads the view.
       *
       * @param view
       * @private
       */
      _reloadView: function(view, filter) {
         view.reload(filter, view.getSorting(), 0, undefined, undefined, true);
      },


      _startHierSearch: function(text) {
         var curFilter = this._options.view.getFilter();
         if (!this._lastDepth && !this._searchMode && curFilter['Разворот']) {
            this._lastDepth = curFilter['Разворот'];
         }

         var searchParamName = this._options.searchParamName,
            /* Нельзя модифицировать оригинальный объект фильтра,
               иначе эти изменения применятся везде, кто использует этот объект по ссылке */
            filter = cMerge({
                'Разворот': 'С разворотом',
                'usePages': 'full'
             }, curFilter, {preferSource: true}),
             view = this._options.view,
             self = this;

         /* Проекции может не быть, если например начали искать до первой загрузки данных,
            поэтому делаю метод обёртку, который проверяет, есть ли проекция */
         function callProjectionMethod(method, args) {
            var projection = view._getItemsProjection();

            if(projection) {
               projection[method].apply(projection, args);
            }
         }

         filter[searchParamName] = text;
         if(self._options.hierarchyViewMode) {
            view._setHierarchyViewMode(true);
            // При включении режима поиска - отключаем virtualScrolling (в настоящий момент мы не умеем совмещать
            // отображение путей до найденных записей и virtualScrolling)
            if (view._virtualScrollController) {
               view._virtualScrollController.disableScrollHandler(true);
               view._options.virtualScrolling = false;
            }
         } else {
            view.setExpand(true);
         }
         view.setHighlightText(text, false);
         view.setHighlightEnabled(true);

         if (self._isInfiniteScroll == undefined) {
            self._isInfiniteScroll = view.isInfiniteScroll();
         }
         view.setInfiniteScroll(true, true);

         if (this._firstSearch) {
            this._lastRoot = view.getCurrentRoot();
            //Запомнили путь в хлебных крошках перед тем как их сбросить для режима поиска
            if (this._options.breadCrumbs && this._options.breadCrumbs.getItems()) {
               this._pathDSRawData = coreClone(this._options.breadCrumbs.getItems().getRawData());
            }
         }
         this._firstSearch = false;
         //Флаг обозначает, что ввод был произведен пользователем
         this._searchReload = true;
         if (this._options.searchMode == 'root') {
            filter[view.getParentProperty()] = undefined;
         }

         view.once('onDataLoad', function() {
            var isEventRaising = view._getItemsProjection() && view._getItemsProjection().isEventRaising(),
                root;
            //Скрываем кнопку назад, чтобы она не наслаивалась на колонки
            if (self._options.backButton) {
               self._options.backButton.getContainer().css({'display': 'none'});
            }
            //Это нужно чтобы поиск был от корня, а крошки при этом отображаться не должны
            if (self._options.breadCrumbs) {
               self._options.breadCrumbs.getContainer().css({'display': 'none'});
            }

            if (self._options.searchMode === 'root') {
               root = view._options.root !== undefined ? view._options.root : null;
               //setParentProperty и setRoot приводят к перерисовке а она должна происходить только при мерже
               // Attention! Achtung! Uwaga! Не трогать аргументы setEventRaising! Иначе перерисовка вызывается до мержа
               // данных (см. очередность события onDataLoad - оно стреляет до помещения новых данных в items).
               if (isEventRaising) {
                  callProjectionMethod('setEventRaising', [false]);
               }
               //Сбрасываю именно через проекцию, т.к. view.setCurrentRoot приводит к отрисовке не пойми чего и пропадает крестик в строке поиска
               callProjectionMethod('setRoot', [root]);
               view._options.currentRoot = root;
               /* Не размораживаем, если проекция была заморожена не нами */
               if (isEventRaising) {
                  callProjectionMethod('setEventRaising', [true]);
               }
            }
         });
   
         view.once('onDrawItems', function() {
            /* Т.к. onDataLoad может стрельнуть несколько раз и до отрисовки,
             то, для того, чтобы не прыгали записи (меняются отступы в режиме поиска),
             класс вешаем по onDrawItems */
            if(self._searchMode && self._options.hierarchyViewMode) {
               view.getContainer().addClass('controls-GridView__searchMode');
            }
         });

         this._reloadView(view, filter);
         this._searchMode = true;

      },

      _startSearch: function(text) {
         var searchParamName = this._options.searchParamName,
             view = this._options.view,
             filter = cMerge({
                'usePages': 'full'
             }, view.getFilter(), {preferSource: true});

         filter[searchParamName] = text;
         view.setHighlightText(text, false);
         view.setHighlightEnabled(true);
         view.setInfiniteScroll(true, true);
         this._reloadView(view, filter);
      },

      _resetSearch: function() {
         var view = this._options.view,
            filter = view.getFilter();

         delete(filter[this._options.searchParamName]);
         delete(filter.usePages);
         this._reloadView(view, filter);
      },

      _resetGroup: function() {
         var view = this._options.view,
             filter = coreClone(view.getFilter()),
             self = this,
             resetProjectionRoot = function() {
                view._getItemsProjection().setRoot(self._lastRoot ||  view.getRoot() || null);
             },
             resetRoot = function() {
                view._options.currentRoot = self._lastRoot ||  view.getRoot() || null;
                //Проекции ещё может не быть при сбросе поиска
                if(view._getItemsProjection()) {
                   resetProjectionRoot();
                } else {
                   view.once('onItemsReady', function() {
                      resetProjectionRoot();
                   });
                }
             };
            
         
         if (this._lastDepth) {
            filter['Разворот'] = this._lastDepth;
         } else {
            delete filter['Разворот'];
         }
         
         this._lastDepth = null;
         delete(filter[this._options.searchParamName]);
         delete(filter.usePages);
         //При сбрасывании группировки в иерархии нужно снять класс-можификатор, но сделать это можно
         //только после релоада, иначе визуально будут прыжки и дерганья (класс меняет паддинги)
         view.once('onDataLoad', function() {
            view._container.removeClass('controls-GridView__searchMode');
            /* Отктываю правку по установке корня через setCurrentRoot,
             т.к. появлялась ошибка при сценарии: ищем что-то, пока грузится сбрасываем поиск,
             и сразу опять что-то ищем. В фильтре списка оставался неправильный раздел. */
            //view.setCurrentRoot(self._lastRoot || null);
            resetRoot();
         });
         this._searchMode = false;
         if(this._options.hierarchyViewMode) {
            view._setHierarchyViewMode(false);
            // При включении режима поиска - отключаем virtualScrolling (в настоящий момент мы не умеем совмещать
            // отображение путей до найденных записей и virtualScrolling)
            if (view._virtualScrollController) {
               view._options.virtualScrolling = true;
               view._virtualScrollController.updateProjection(view._getItemsProjection());
               view._virtualScrollController.reset();
            }
         } else {
            view.setExpand(false);
            /* Закрываем ветки после сброса поиска через опцию,
               чтобы не вызвалась лишняя перерисовка */
            view._options.openedPath = {};
         }
         //Если мы ничего не искали, то и сбрасывать нечего
         if (this._firstSearch) {
            return;
         }
         view.setInfiniteScroll(this._isInfiniteScroll, true);
         this._isInfiniteScroll = undefined;
         this._firstSearch = true;
         if (this._searchReload) {
            //Нужно поменять фильтр и загрузить нужный корень.
            //TODO менять фильтр в контексте, когда появятся data-binding'и
            filter[view.getParentProperty()] = this._lastRoot;
            // TODO: Нужно оставить одно поле хранящее путь, сейчас в одно запоминается состояние хлебных крошек
            // перед тем как их сбросить, а в другом весь путь вместе с кнопкой назад

            //Если сбросили поиск (по крестику) вернем путь в хлебные крошки и покажем кнопку назад
            view.once('onDataLoad', function() {
               self._path = self._pathDSRawData || [];
               if (self._options.breadCrumbs) {
                  self._options.breadCrumbs.getContainer().css({'display': ''});
                  self._options.breadCrumbs._redraw();
               }
               if (self._options.backButton) {
                  self._options.backButton.getContainer().css({'display': ''});
               }
            });
   
            //DataGridView._filter = filter;
            //DataGridView.setCurrentRoot(self._lastRoot); - плохо, потому что ВСЕ крошки на странице получат изменения
            //Релоад сделает то же самое, так как он стреляет onSetRoot даже если корень на самом деле не понменялся
            this._reloadView(view, filter);
         } else {
            //Очищаем крошки. TODO переделать, когда появятся привзяки по контексту
            view.setFilter(filter, true);
         }
      },

      bindSearch: function() {
         var self = this,
            view = this._options.view,
            isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS/Mixins/TreeMixin'),
         searchForm = this._options.searchForm;

         if (!this._kbLayoutRevertObserver) {
            this._kbLayoutRevertObserver = new KbLayoutRevertObserver({
               textBox: searchForm,
               view: view,
               param: this._options.searchParamName,
               newStandart: self._options.keyboardLayoutRevertNew
            })
         }
         else {
            this._kbLayoutRevertObserver.setParam(this._options.searchParamName);
         }
         if (isTree) {
            this._lastRoot = view.getCurrentRoot();
            view.subscribe('onBeforeSetRoot', function(ev, newRoot) {
               self._lastRoot = newRoot;
               if (self._searchMode) {
                  self._breakSearch(false);
               }
            });

            view.subscribe('onSetRoot', function(event, curRoot, hierarchy) {
               //onSetRoot стреляет после того как перешли в режим поиска (так как он стреляет при каждом релоаде),
               //при этом не нужно запоминать текущий корень и делать видимым путь
               if (!self._searchMode) {
                  self._lastRoot = curRoot;
                  //Запоминаем путь в хлебных крошках при смене корня
                  //Похоже на то, что его достаточно запоминать только непосредственно перед началом поиска
                  if (self._options.breadCrumbs && self._options.breadCrumbs.getItems()) {
                     var crumbsItems = self._options.breadCrumbs.getItems();
                     self._pathDSRawData = crumbsItems ? crumbsItems.getRawData() : [];
                     self._options.breadCrumbs.getContainer().css({'display': ''});
                  }
                  if (self._options.backButton) {
                     self._options.backButton.getContainer().css({'display': ''});
                  }
               }
            });
         }

         this._subscribeOnSearchFormEvents();
         if(searchForm.getText()) {
            searchForm.applySearch(false);
         }
      },

      _subscribeOnSearchFormEvents: function() {
         var searchForm = this._options.searchForm,
            view = this._options.view,
            self = this,
            isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS/Mixins/TreeMixin');
         
         this.subscribeTo(searchForm, 'onReset', function() {
            view.setHighlightText('', false);
            view.setHighlightEnabled(false);
            self._kbLayoutRevertObserver.stopObserve();
         });
   
         if (!this._options.doNotRespondOnReset) {
            this.subscribeTo(searchForm, 'onReset', function() {
               if (isTree) {
                  self._resetGroup();
               } else {
                  self._resetSearch();
               }
            });
         }
   
         this.subscribeTo(searchForm, 'onSearch', function(event, text, forced) {
            var view = self._options.view;
            
            /* Если у поля поиска есть автодополнение,
               то поиск надо запускать только по enter'у / выбору из автодополнения. */
            if(searchForm.getProperty('usePicker') && text) {
               /* Если поиск происходит в автодополнении, то его надо разрешать */
               if( (!self._options.searchFormWithSuggest && (!forced || searchForm.isPickerVisible())) || (self._options.searchFormWithSuggest && forced) ) {
                  return;
               }
            }
            
            //Не запускаем поиск, если уже происходит поиск с таким же фильтром
            if (self._searchMode && view.isLoading() && view.getFilter()[self._options.searchParamName] === text) {
               return;
            }

            if(self._options.keyboardLayoutRevert) {
               /* Если в этот момент уже происходит поиск,
                  то механизм смены раскладки надо обновить, чтобы он работал от текущего поиска  */
               if(view.isLoading()) {
                  self._kbLayoutRevertObserver.stopObserve();
               }
               self._kbLayoutRevertObserver.startObserve();
            }
            if (isTree) {
               self._startHierSearch(text);
            } else {
               self._startSearch(text);
            }
         });
   
         this.subscribeTo(searchForm, 'onKeyPressed', function(eventObject, event) {
            /* Строка поиска связывается searchController'ом со списком в браузере и со списком в автодополнении,
               когда открыто автодополнение, клик по стрелкам на клавиатуре должен приводить к навигации по списку в автодополнении */
            var
               abortKeyPressedProcess = searchForm.isPickerVisible() && !self._options.searchFormWithSuggest;
            /* Нет смысла обрабатывать клавиши и устанавливать фокус, если
               view с которой работает searchForm скрыта.
               (актуально для поля связи / suggestTextBox'a / строки поиска с саггестом ) */
            if(!isElementVisible(view.getContainer()) || abortKeyPressedProcess) {
               return;
            }

            if (view._scrollPager) {
               if (event.which === constants.key.pageDown) {
                  view._scrollPager._goToNext();
               }
               if (event.which === constants.key.pageUp) {
                  view._scrollPager._goToPrev();
               }
            }


            // переводим фокус на view и устанавливаем активным первый элемент, если поле пустое, либо курсор стоит в конце поля ввода
            if (event.which == constants.key.down && (!this.getText() || this.getText().length === this._inputField[0].selectionStart)) {
               var selectedIndex = null,
                   itemsProjection = view._getItemsProjection(),
                  currentSelectedIndex;
               /* При поиске по дереву папки отображаются, как Хлебные крошки
                  поэтому маркер нужно установить на первый элемент проекции, который не является папкой */
               if(self._searchMode && !!itemsProjection.getCount() && itemsProjection.at(0).isNode) {
                  itemsProjection.each(function (item, index) {
                     if (!selectedIndex && !item.isNode()) {
                        selectedIndex = index;
                     }
                  });

                  view.setSelectedIndex(selectedIndex);
               }else {
                  currentSelectedIndex = view.getSelectedIndex();
                  /* При нажатии кнопки вниз в строке поиска ожидается :
                   что появится маркер на view (если его не было) / перейдёт на следующую строку (если был).
                   Поэтому обрабатываем две ситуации, когда маркера нет, то устанавливаем selectedIndex на первый элемент,
                   если он есть, то просто увеличиваем selectedIndex на единицу, чтобы маркер перескочил на следующий элемент.
                   При этом проверяем, чтобы индекс не установился на группуировку, т.к. на неё маркер не ставится. */
                  itemsProjection.each(function(item, index) {
                     if (selectedIndex === null && index > currentSelectedIndex && !cInstance.instanceOfModule(item, "WS.Data/Display/GroupItem")) {
                        selectedIndex = index;
                     }
                  });
   
                  view.setSelectedIndex(selectedIndex);
               }

               view.setActive(true);
               event.stopPropagation();
               event.preventDefault();
            }
         });
      },

      /**
       * Устанавливает имя параметра поиска
       * @param {String} name имя параметра поиска
       */
      setSearchParamName: function(name) {
         this._options.searchParamName = name;
      }

   });

   return SearchController;

});
