define('Controls-demo/List/Grid/resources/DataDemoPG', ['Controls-demo/resources/Images'],
    function(DemoImages) {
        var showType = {

            //show only in Menu
            MENU: 0,

            //show in Menu and Toolbar
            MENU_TOOLBAR: 1,

            //show only in Toolbar
            TOOLBAR: 2
        };
       return {
          fullEditableColumns: [
             {
                displayProperty: 'name',
                width: '1fr',
                template: 'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem'
             },
             {
                displayProperty: 'rating',
                width: 'auto',
                align: 'right'
             },
             {
                displayProperty: 'year',
                width: 'auto',
                align: 'right'
             },
             {
                displayProperty: 'country',
                width: 'auto',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem'
             },
             {
                displayProperty: 'boxOffice',
                width: 'auto',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/DemoMoney'
             },
             {
                displayProperty: 'awards',
                width: 'auto',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem'
             }
          ],
          partialEditableColumns: [
             {
                displayProperty: 'name',
                width: '200px',
                template: 'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem'
             },
             {
                displayProperty: 'rating',
                width: '50px',
                align: 'right'
             },
             {
                displayProperty: 'country',
                width: '200px',
                template: 'wml!Controls-demo/List/Grid/resources/EditableGridPG/editableItem'
             }
          ],
          partialEditableHeader: [
             {
                title: 'Film title'
             },
             {
                title: 'Rating',
                align: 'right'
             },
             {
                title: 'Country'
             }
          ],
          fullColumns: [
             {
                displayProperty: 'name',
                width: '1fr'
             },
             {
                displayProperty: 'rating',
                width: 'auto',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/DemoRating'
             },
             {
                displayProperty: 'year',
                width: 'auto',
                align: 'right'
             },
             {
                displayProperty: 'country',
                width: 'auto',
                align: 'right'
             },
             {
                displayProperty: 'boxOffice',
                width: 'auto',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/DemoMoney'
             },
             {
                displayProperty: 'awards',
                width: 'auto',
                align: 'right'
             }
          ],
          partialColumns: [
             {
                displayProperty: 'name',
                width: '200px'
             },
             {
                displayProperty: 'awards',
                width: '50px',
                textOverflow: 'ellipsis'
             },
             {
                displayProperty: 'rating',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/DemoRating'
             },
             {
                displayProperty: 'year',
                width: 'auto',
                align: 'right'
             }
          ],
          partialHeader: [
             {
                title: 'So long header for film name that we need to set width'
             },
             {
                title: 'Awards'
             },
             {
                title: 'Rating',
                width: '170px'
             },
             {
                title: 'Year',
                align: 'right'
             }
          ],
          fullHeader: [
             {
                title: ''
             },
             {
                title: 'Rating',
                align: 'right'
             },
             {
                title: 'Year',
                align: 'right'
             },
             {
                title: 'Country',
                align: 'right'
             },
             {
                title: 'Box Office',
                align: 'right',
                sortingProperty: 'boxOffice'
             },
             {
                title: 'Awards',
                align: 'right'
             }
          ],
          fullHeaderForBase: [
             {
                title: ''
             },
             {
                title: 'Rating',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/BasePG/HeaderMoneyTemplate'
             },
             {
                title: 'Box Office',
                align: 'right',
                sortingProperty: 'boxOffice'
             }
          ],
          fullColumnsForBase: [
             {
                displayProperty: 'name',
                width: '1fr'
             },
             {
                displayProperty: 'rating',
                width: '200px',
                align: 'right',
                resultTemplate: 'wml!Controls-demo/List/Grid/resources/DemoResultAvgRating',
                template: 'wml!Controls-demo/List/Grid/resources/DemoRating'
             },
             {
                displayProperty: 'boxOffice',
                width: '100px',
                align: 'right',
                template: 'wml!Controls-demo/List/Grid/resources/DemoMoney'
             }
          ],
          catalog: [
             {
                id: 1,
                name: 'The Shawshank Redemption',
                rating: 9.190,
                year: 1994,
                country: 'USA',
                budget: 25,
                boxOffice: 59.8,
                awards: 'Oscar 1995',
                genre: 'Drama',
                noHighlightOnHover: 'wml!Controls-demo/List/Grid/resources/ItemTemplatePG/noHighlightOnHover'

             },
             {
                id: 2,
                name: 'The Green Mile',
                rating: 9.134,
                year: 1999,
                country: 'USA',
                budget: 90,
                boxOffice: 286.8,
                awards: 'Oscar 2000, MTV 00',
                genre: 'Thriller'
             },
             {
                id: 3,
                name: 'Forrest Gump',
                rating: 9.013,
                year: 1994,
                country: 'USA',
                budget: 55,
                boxOffice: 677.4,
                awards: 'Oscar 1995, MTV 95',
                genre: 'Tragicomedy',
                noHighlightOnHover: 'wml!Controls-demo/List/Grid/resources/ItemTemplatePG/noHighlightOnHover'

             },
             {
                id: 4,
                name: 'Intouchables',
                rating: 8.834,
                year: 2011,
                country: 'France',
                budget: 13,
                boxOffice: 426.6,
                awards: 'Cesar 2012',
                genre: 'Tragicomedy'

             },
             {
                id: 5,
                name: 'Leon',
                rating: 8.775,
                year: 1994,
                country: 'France',
                budget: 20,
                boxOffice: 19.5,
                awards: 'Cesar 1995',
                genre: 'Drama',
                noHighlightOnHover: 'wml!Controls-demo/List/Grid/resources/ItemTemplatePG/noHighlightOnHover'
             },
             {
                id: 6,
                name: 'Inception',
                rating: 8.773,
                year: 2010,
                country: 'USA',
                budget: 160,
                boxOffice: 825.5,
                awards: 'Oscar 2011',
                genre: 'Thriller'
             }
          ],
          stickyDataColumns: [
             {
                template: 'wml!Controls-demo/List/Grid/resources/StickyPG/TasksPhoto',
                width: '98px'
             },
             {
                template: 'wml!Controls-demo/List/Grid/resources/StickyPG/TasksDescr',
                width: '1fr'
             },
             {
                template: 'wml!Controls-demo/List/Grid/resources/StickyPG/TasksReceived',
                width: 'auto'
             }
          ],
          stickyData: [
             {
                id: 1,
                message: 'Регламент: Ошибка в разработку. Автор: Дубенец Д.А. Описание: (reg-chrome-presto) 3.18.150 controls - Поехала верстка кнопок когда они задизейблены prestocarry',
                fullName: 'Крайнов Дмитрий',
                photo: DemoImages.staff.krainov,
                date: '6 мар',
                state: 'Review кода (нач. отдела)'
             },
             {
                id: 2,
                message: 'Регламент: Ошибка в разработку. Автор: Волчихина Л.С. Описание: Отображение колонок. При снятии галки с колонки неверная всплывающая подсказка',
                fullName: 'Крайнов Дмитрий',
                photo: DemoImages.staff.krainov,
                date: '6 мар',
                state: 'Review кода (нач. отдела)'
             },
             {
                id: 3,
                message: 'Смотри надошибку. Нужно сделать тесты, чтобы так в будущем не разваливалось',
                fullName: 'Крайнов Дмитрий',
                photo: DemoImages.staff.krainov,
                date: '6 мар',
                state: 'Выполнение'
             },
             {
                id: 4,
                message: 'Регламент: Ошибка в разработку. Автор: Оборевич К.А. Описание: Розница. Замечания к шрифтам в окнах Что сохранить в PDF/Excel и Что напечатать',
                fullName: 'Крайнов Дмитрий',
                photo: DemoImages.staff.krainov,
                date: '12 ноя',
                state: 'Review кода (нач. отдела)'
             },
             {
                id: 5,
                message: 'Пустая строка при сканировании в упаковку Тест-онлайн adonis1/adonis123 1) Создать документ списания 2) отсканировать в него наименование/открыть РР/+Упаковка 3) Заполнить данные по упаковке/отсканировать еще 2 марки',
                fullName: 'Корбут Антон',
                photo: DemoImages.staff.korbyt,
                date: '5 мар',
                state: 'Выполнение'
             },
             {
                id: 6,
                message: 'Разобраться с getViewModel - либо наследование, либо создавать модель прямо в TreeControl и передавать в BaseControl, либо ещё какой то вариант придумать.',
                fullName: 'Кесарева Дарья',
                photo: DemoImages.staff.kesareva,
                date: '12 сен',
                state: 'Выполнение'
             },
             {
                id: 7,
                message: 'Научить reload обновлять табличное представление VDOM с сохранением набранных данных (например загруженных по кнопке "еще"). В данный момент есть deepReload, но он не сохраняет набранные данные.',
                fullName: 'Кесарева Дарья',
                photo: DemoImages.staff.kesareva,
                date: '12 сен',
                state: 'Выполнение'
             },
             {
                id: 8,
                message: 'Лесенка на VDOM. Перевести алгоритм на предварительный расчет в модели. Сделать демку.',
                fullName: 'Кесарева Дарья',
                photo: DemoImages.staff.kesareva,
                date: '12 сен',
                state: 'Выполнение'
             },
             {
                id: 9,
                message: 'Прошу сделать возможность отключения: 1) ховера на айтемах  у Controls/List, 2) курсор: поинтер',
                fullName: 'Кесарева Дарья',
                photo: DemoImages.staff.kesareva,
                date: '12 сен',
                state: 'Выполнение'
             },
             {
                id: 10,
                message: 'через шаблон ячейки должна быть возможность управлять colspan (или rowspan) отдельной ячейки. <ws:partial template="standartCellTemplate" colspan="2"> типа такого если я напишу, то у меня будет ячейка на две колонки',
                fullName: 'Кесарева Дарья',
                photo: DemoImages.staff.kesareva,
                date: '12 сен',
                state: 'Выполнение'
             },
             {
                id: 11,
                message: 'Не работают хлебные крошки и навигация по ним если идентификатор записи равен 0 Как повторить',
                fullName: 'Догадкин Владимир',
                photo: DemoImages.staff.dogadkin,
                date: '26 фев',
                state: 'Выполнение'
             },
             {
                id: 12,
                message: 'Не работает collapse в группировке в дереве test-online.sbis.ru сталин/Сталин123',
                fullName: 'Догадкин Владимир',
                photo: DemoImages.staff.dogadkin,
                date: '26 фев',
                state: 'Выполнение'
             }
          ],
          firstItemActionsArray: [
             {
                id: 1,
                icon: 'icon-EmoiconSmile',
                title: 'Like it',
                showType: showType.TOOLBAR,
                handler: function(item) {
                   console.log('itemActionsClick(Like it)', item);
                }
             },
             {
                id: 2,
                icon: 'icon-EmoiconAnnoyed',
                showType: showType.TOOLBAR,
                title: 'Dislike it',
                handler: function(item) {
                   console.log('itemActionsClick(Dislike it)', item);
                }
             },
             {
                id: 3,
                icon: 'icon-AddButton',
                title: 'Add to favorite',
                showType: showType.TOOLBAR,
                handler: function(item) {
                   console.log('itemActionsClick(Add to favorite)', item);
                }
             },
             {
                id: 7,
                icon: 'icon-Erase',
                iconStyle: 'danger',
                title: 'Remove from list',
                showType: showType.MENU,
                handler: function() {
                   console.log('itemActionsClick(Remove from list)');
                }
             },
             {
                id: 4,
                icon: 'icon-Profile2',
                title: 'Actors',
                parent: null,
                'parent@': true,
                handler: function() {
                   console.log('itemActionsClick(Actors)', item);
                }
             },
             {
                id: 5,
                icon: 'icon-InputHistory',
                title: 'Show all',
                parent: 4,
                'parent@': false,
                handler: function() {
                   console.log('itemActionsClick(Show all)', item);
                }
             },
             {
                id: 6,
                icon: 'icon-ContactSearch',
                title: 'More films with same actors',
                parent: 4,
                'parent@': false,
                handler: function() {
                   console.log('itemActionsClick(More films with same actors)', item);
                }
             }
          ],
          secondItemActionsArray: [
             {
                id: 1,
                icon: 'icon-Attach',
                title: 'Attach file',
                showType: showType.MENU_TOOLBAR,
                handler: function(item) {
                   console.log('itemActionsClick(Attach file)', item);
                }
             },
             {
                id: 2,
                icon: 'icon-Edit',
                title: 'Edit film',
                showType: showType.MENU_TOOLBAR,
                parent: null,
                'parent@': true,
                handler: function(item) {
                   console.log('itemActionsClick(Edit film)', item);
                }
             },
             {
                id: 3,
                icon: 'icon-FillintheInformation',
                title: 'Edit description',
                parent: 2,
                'parent@': false,
                showType: showType.MENU,
                handler: function(item) {
                   console.log('itemActionsClick(Edit description)', item);
                }
             },
             {
                id: 4,
                icon: 'icon-TFFileVideo',
                title: 'Edit media',
                showType: showType.MENU,
                parent: 2,
                'parent@': false,
                handler: function(item) {
                   console.log('itemActionsClick(Edit media)', item);
                }
             },
             {
                id: 5,
                icon: 'icon-Hide',
                title: 'Hide',
                showType: showType.MENU_TOOLBAR,
                handler: function() {
                   console.log('itemActionsClick(Hide)');
                }
             },
             {
                id: 6,
                icon: 'icon-Erase',
                iconStyle: 'Delete',
                title: 'Delete',
                showType: showType.MENU,
                handler: function() {
                   console.log('itemActionsClick(Delete)');
                }
             }
          ]
       };
    });
