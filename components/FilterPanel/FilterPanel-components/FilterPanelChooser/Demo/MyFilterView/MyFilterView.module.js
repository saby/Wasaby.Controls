define('js!SBIS3.CONTROLS.Demo.MyFilterView',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyFilterView',
        'js!WS.Data/Collection/RecordSet',
        'css!SBIS3.CONTROLS.Demo.MyFilterView',
        'js!SBIS3.CONTROLS.FilterPanelChooser.List',
        'js!SBIS3.CONTROLS.FilterPanelChooser.DictionaryList',
        'js!SBIS3.CONTROLS.FilterPanelChooser.FavoritesList',
        'js!SBIS3.CONTROLS.FilterPanelChooser.RadioGroup'
    ],
    function(CompoundControl, dotTplFn, RecordSet) {
        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            init: function () {
                moduleClass.superclass.init.call(this);

            },
            _modifyOptions: function (cfg) {
                cfg.favorites = new RecordSet({
                    rawData: [{'title': 'Владимирская область', 'id': 2, count: 12},
                        {'title': 'Нижегородская область', 'id': 3, count: 13}
                    ],
                    idProperty: 'id'
                });
                cfg.items1 = new RecordSet({
                    rawData: [{'title': 'Краснодарский край', 'id': 1, count: 91},
                        {'title': 'Астраханская область', 'id': 4, count: 14},
                        {'title': 'Владимирская область', 'id': 2, count: 42},
                        {'title': 'Нижегородская область', 'id': 3, count: 13},
                        {'title': 'Белгородская область', 'id': 5, count: 25},
                        {'title': 'Вологодская область', 'id': 6, count: 16},
                        {'title': 'Псковская область', 'id': 7, count: 17},
                        {'title': 'Самарская область', 'id': 8, count: 18},
                        {'title': 'Ярославская область', 'id': 9, count: 19},
                        {'title': 'Московская область', 'id': 10, count: 10},
                        {'title': 'Калужская область', 'id': 11, count: 20},
                        {'title': 'Республика Крым', 'id': 12, count: 21}
                    ],
                    idProperty: 'id'
                });
                cfg.items2 = new RecordSet({
                    rawData: [{'title': 'Краснодарский край', 'id': 1, count: 11},
                        {'title': 'Владимирская область', 'id': 2, count: 12},
                        {'title': 'Нижегородская область', 'id': 3, count: 13}
                    ],
                    idProperty: 'id'
                });
                cfg.items3 = new RecordSet({
                    rawData: [{'title': 'Краснодарский край', 'id': 1, count: 11},
                        {'title': 'Владимирская область', 'id': 2, count: 12},
                        {'title': 'Нижегородская область', 'id': 3, count: 13}
                    ],
                    idProperty: 'id'
                });
                cfg.items4 = new RecordSet({
                    rawData: [{'title': 'Краснодарский край', 'id': 1, count: 11},
                        {'title': 'Владимирская область', 'id': 2, count: 12},
                        {'title': 'Нижегородская область', 'id': 3, count: 13}
                    ],
                    idProperty: 'id'
                });
                cfg.prop1 = {
                    properties: {
                        items: cfg.items1,
                        displayProperty: 'title',
                        idProperty: 'id'
                    },
                    value: [1, 2, 3]
                };
                cfg.prop2 = {
                    properties: {
                        items: cfg.items2,
                        displayProperty: 'title',
                        idProperty: 'id',
                        dictionaryOptions: {
                            template: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate'
                        }
                    },
                    value: [1, 2, 3]
                };
                cfg.prop3 = {
                    properties: {
                        items: cfg.items3,
                        favorites: cfg.favorites,
                        favoritesCount: 10,
                        displayProperty: 'title',
                        idProperty: 'id',
                        dictionaryOptions: {
                            template: 'js!SBIS3.CONTROLS.Demo.FilterViewDemoTemplate'
                        }
                    },
                    value: [2, 3]
                };
                cfg.prop4 = {
                    properties: {
                        items: cfg.items4,
                        displayProperty: 'title',
                        idProperty: 'id'
                    },
                    value: 3
                };
                return cfg;
            }
        });
        return moduleClass;
    }
);