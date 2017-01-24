define('js!SBIS3.CONTROLS.SearchController',
    [
       'js!SBIS3.CONTROLS.Utils.KbLayoutRevertObserver',
       "Core/constants",
       "Core/core-functions",
       "Core/core-merge",
       "Core/Abstract",
       "Core/core-instance",
       'Core/helpers/dom&controls-helpers'
    ], function(KbLayoutRevertObserver, constants, cFunctions, cMerge, cAbstract, cInstance, domHelpers) {

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
            keyboardLayoutRevert: true

         },
         _kbLayoutRevertObserver: null,
         _firstSearch: true,
         _searchReload: true,
         _searchMode: false,
         _searchForm: undefined,
         _lastRoot: undefined
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

      _startHierSearch: function(text) {
         var searchParamName = this._options.searchParamName,
             filter = cMerge(this._options.view.getFilter(), {
                'Разворот': 'С разворотом',
                'usePages': 'full'
             }),
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
         view._options.hierarchyViewMode = true;
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
               this._pathDSRawData = cFunctions.clone(this._options.breadCrumbs.getItems().getRawData());
            }
         }
         this._firstSearch = false;
         //Флаг обозначает, что ввод был произведен пользователем
         this._searchReload = true;
         if (this._options.searchMode == 'root') {
            filter[view.getParentProperty()] = undefined;
         }

         view.once('onDataLoad', function(event, data) {
            var root;
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
               callProjectionMethod('setEventRaising',[false, true]);
               //Сбрасываю именно через проекцию, т.к. view.setCurrentRoot приводит к отрисовке не пойми чего и пропадает крестик в строке поиска
               callProjectionMethod('setRoot', [root]);
               view._options._curRoot = root;
               callProjectionMethod('setEventRaising', [true, true]);
            }
         });

         view.reload(filter, view.getSorting(), 0).addCallback(function() {
            view._container.addClass('controls-GridView__searchMode');
         });
         this._searchMode = true;

      },

      _startSearch: function(text) {
         var searchParamName = this._options.searchParamName,
             view = this._options.view,
             filter = cMerge(view.getFilter(), {
                'usePages': 'full'
             });

         filter[searchParamName] = text;
         view.setHighlightText(text, false);
         view.setHighlightEnabled(true);
         view.setInfiniteScroll(true, true);
         view.reload(filter, view.getSorting(), 0);

      },

      _resetSearch: function() {
         var view = this._options.view,
            filter = view.getFilter();

         delete(filter[this._options.searchParamName]);
         view.setHighlightText('', false);
         view.setHighlightEnabled(false);
         view.reload(filter, view.getSorting(), 0);
      },

      _resetGroup: function() {
         var
            view = this._options.view,
            filter = cMerge(view.getFilter(), {
               'Разворот': 'Без разворота'
            }),
            self = this;
         delete(filter[this._options.searchParamName]);
         //При сбрасывании группировки в иерархии нужно снять класс-можификатор, но сделать это можно
         //только после релоада, иначе визуально будут прыжки и дерганья (класс меняет паддинги)
         view.once('onDataLoad', function() {
            view._container.removeClass('controls-GridView__searchMode');
            view.setCurrentRoot(self._lastRoot || null);
         });
         this._searchMode = false;
         view._options.hierarchyViewMode = false;
         //Если мы ничего не искали, то и сбрасывать нечего
         if (this._firstSearch) {
            return;
         }
         view.setInfiniteScroll(this._isInfiniteScroll, true);
         this._isInfiniteScroll = undefined;
         view.setHighlightText('', false);
         view.setHighlightEnabled(false);
         this._firstSearch = true;
         if (this._searchReload) {
            //Нужно поменять фильтр и загрузить нужный корень.
            //TODO менять фильтр в контексте, когда появятся data-binding'и
            filter[view.getParentProperty()] = this._lastRoot;
            //DataGridView._filter = filter;
            //DataGridView.setCurrentRoot(self._lastRoot); - плохо, потому что ВСЕ крошки на странице получат изменения
            //Релоад сделает то же самое, так как он стреляет onSetRoot даже если корень на самом деле не понменялся
            view.reload(filter, view.getSorting(), 0);
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
            })
         } else {
            //Очищаем крошки. TODO переделать, когда появятся привзяки по контексту
            view.setFilter(filter, true);
         }
      },

      bindSearch: function() {
         var self = this,
            view = this._options.view,
            isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin'),
         searchForm = this._options.searchForm;

         if (!this._kbLayoutRevertObserver) {
            this._kbLayoutRevertObserver = new KbLayoutRevertObserver({
               textBox: searchForm,
               view: view,
               param: this._options.searchParamName
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
         searchForm.applySearch(false);
      },

      _subscribeOnSearchFormEvents: function() {
         var searchForm = this._options.searchForm,
            view = this._options.view,
            self = this,
            isTree = cInstance.instanceOfMixin(view, 'SBIS3.CONTROLS.TreeMixin');
         if (!this._options.doNotRespondOnReset) {
            searchForm.subscribe('onReset', function(event, text) {
               self._kbLayoutRevertObserver.stopObserve();
               if (isTree) {
                  self._resetGroup();
               } else {
                  self._resetSearch();
               }
            });
         }

         searchForm.subscribe('onSearch', function(event, text, forced) {
            /* Если у поля поиска есть автодополнение,
               то поиск надо запускать только по enter'у / выбору из автодополнения. */
            if(searchForm.getProperty('usePicker') && text) {
               /* Если поиск происходит в автодополнении, то его надо разрешать */
               if( (!self._options.searchFormWithSuggest && (!forced || searchForm.isPickerVisible())) || (self._options.searchFormWithSuggest && forced) ) {
                  return;
               }
            }

            if(self._options.keyboardLayoutRevert) {
               self._kbLayoutRevertObserver.startObserve();
            }
            if (isTree) {
               self._startHierSearch(text);
            } else {
               self._startSearch(text);
            }
         });

         searchForm.subscribe('onKeyPressed', function(eventObject, event) {
            /* Нет смысла обрабатывать клавиши и устанавливать фокус, если
               view с которой работает searchForm скрыта.
               (актуально для поля связи / suggestTextBox'a / строки поиска с саггестом ) */
            if(!domHelpers.isElementVisible(view.getContainer())) {
               return;
            }

            // переводим фокус на view и устанавливаем активным первый элемент, если поле пустое, либо курсор стоит в конце поля ввода
            if ((event.which == constants.key.tab || event.which == constants.key.down) && (this.getText() === '' || this.getText().length === this._inputField[0].selectionStart)) {
               var selectedIndex = null,
                   itemsProjection = view._getItemsProjection();
               /* При поиске по дереву папки отображаются, как Хлебные крошки
                  поэтому маркер нужно установить на первый элемент проекции, который не является папкой */
               if(self._searchMode && itemsProjection.at(0).isNode) {
                  itemsProjection.each(function (item, index) {
                     if (!selectedIndex && !item.isNode()) {
                        selectedIndex = index;
                     }
                  });

                  view.setSelectedIndex(selectedIndex);
               }else {
                  selectedIndex = view.getSelectedIndex();
                  /* При нажатии кнопки вниз в строке поиска ожидается :
                   что появится маркер на view (если его не было) / перейдёт на следующую строку (если был).
                   Поэтому обрабатываем две ситуации, когда маркера нет, то устанавливаем selectedIndex на первый элемент,
                   если он есть, то просто увеличиваем selectedIndex на единицу, чтобы маркер перескочил на следующий элемент. */
                  if(selectedIndex === null) {
                     view.setSelectedIndex(0);
                  } else {
                     view.setSelectedIndex(selectedIndex + 1);
                  }
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