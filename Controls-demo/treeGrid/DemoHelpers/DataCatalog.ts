export const Gadgets = {
    getDataSet() {
        return [
            {
                id: 1, title: 'Node', Раздел: null, 'Раздел@': true, Раздел$: null, hasChild: true
            },
            {
                id: 11, title: 'Node', Раздел: 1, 'Раздел@': true, Раздел$: null
            },
            {
                id: 111, title: 'Leaf', Раздел: 11, 'Раздел@': null, Раздел$: null
            },
            {
                id: 12, title: 'Hidden node', Раздел: 1, 'Раздел@': false, Раздел$: true
            },
            {
                id: 13, title: 'Leaf', Раздел: 1, 'Раздел@': null, Раздел$: null
            },
            {
                id: 2, title: 'Node 2', Раздел: null, 'Раздел@': true, Раздел$: null, hasChild: true
            },
            {
                id: 21, title: 'Leaf 21', Раздел: 2, 'Раздел@': null, Раздел$: null
            },
            {
                id: 3, title: 'Node 3', Раздел: null, 'Раздел@': true, Раздел$: null, hasChild: false
            }
        ];
    },

    getFlatData() {
        return [
            {
                id: 1,
                title: 'Apple',
                country: 'США',
                rating: '8.5',
                parent: null,
                type: true,
                hasChild: true
            },
            {
                id: 2,
                title: 'Smartphones',
                parent: 1,
                rating: '9.2',
                type: true,
                hasChild: true
            },
            {
                id: 3,
                title: 'iPhone 4s',
                rating: '9.5',
                parent: 2,
                type: null
            },
            {
                id: 4,
                title: 'iPhone 4',
                rating: '8.9',
                parent: 2,
                type: null
            },
            {
                id: 6,
                title: 'iPhone X Series',
                rating: '7.6',
                parent: 2,
                type: false
            },
            {
                id: 7,
                title: 'iPhone Xs',
                rating: '7.4',
                parent: 6,
                type: null
            },
            {
                id: 8,
                title: 'iPhone Xs Max',
                rating: '6.8',
                parent: 6,
                type: null
            },
            {
                id: 9,
                title: 'iPhone XR',
                rating: '7.1',
                parent: 6,
                type: null
            },
            {
                id: 10,
                title: 'Notebooks',
                parent: 1,
                rating: '9.4',
                type: false
            },
            {
                id: 11,
                title: 'MacBook Pro',
                rating: '7.2',
                modelId: 'MacBookPro15,4',
                size: '13 дюймов',
                year: '2019',
                note: '2 порта Thunderbolt 3',
                parent: 10,
                type: null
            },
            {
                id: 12,
                title: 'MacBook Pro',
                modelId: 'MacBookPro15,3',
                rating: '6.9',
                size: '15 дюймов',
                year: '2019',
                note: '',
                parent: 10,
                type: null
            },
            {
                id: 13,
                title: 'MacBook Pro',
                modelId: 'MacBookPro15,2',
                size: '13 дюймов',
                rating: '9.1',
                year: '2019',
                note: '4 порта Thunderbolt 3',
                parent: 10,
                type: null
            },
            {
                id: 14,
                title: 'MacBook Pro',
                modelId: 'MacBookPro14,3',
                rating: '8.8',
                size: '15 дюймов',
                year: '2017',
                note: '',
                parent: 10,
                type: null
            },
            {
                id: 15,
                title: 'MacBook Pro',
                modelId: 'MacBookPro14,2',
                size: '13 дюймов',
                rating: '8.5',
                year: '2017',
                note: '4 порта Thunderbolt 3',
                parent: 10,
                type: null
            },
            {
                id: 16,
                title: 'Magic Mouse 2',
                modelId: 'MM16',
                rating: '7.2',
                year: '2016',
                parent: 1,
                type: null
            },
            {
                id: 17,
                title: 'Samsung',
                country: 'Южная Корея',
                rating: '8.0',
                parent: null,
                type: true,
                hasChild: true
            },
            {
                id: 18,
                title: 'Meizu',
                rating: '7.5',
                country: 'КНР',
                parent: null,
                type: true
            },
            {
                id: 19,
                title: 'Asus',
                rating: '7.3',
                country: 'Тайвань',
                parent: null,
                type: false
            },
            {
                id: 20,
                title: 'Acer',
                rating: '7.1',
                country: 'Тайвань',
                parent: null,
                type: false
            }

        ];
    },
    getColumnsForFlat() {
        return [
            {
                displayProperty: 'title'
            }
        ];
    },
    getGridColumnsForFlat() {
        return [
            {
                displayProperty: 'title'
            },
            {
                displayProperty: 'rating'
            },
            {
                displayProperty: 'country'
            }
        ];
    },
    getColumnsWithFixedWidth() {
        return [
            {
                displayProperty: 'title',
                width: '200px'
            },
            {
                displayProperty: 'rating',
                width: '150px'
            },
            {
                displayProperty: 'country',
                width: '150px'
            }
        ];
    },
    getHeaderForFlat() {
        return [
            {
                title: 'Наименование'
            },
            {
                title: 'Рейтинг покупателей'
            },
            {
                title: 'Страна производитель'
            }
        ];
    },
    getLongHeader: () => [
        {
            title: 'Население страны по данным на 2018г - 2019г.'
        },
        {
            title: 'Площадь км2'
        },
        {
            title: 'Плотность населения чел/км2'
        }
    ],
    getMultiHeader: () => [
        {
            title: 'Название',
            startRow: 1,
            endRow: 3,
            startColumn: 1,
            endColumn: 2
        },
        {
            title: 'Общие',
            startRow: 1,
            endRow: 2,
            startColumn: 2,
            endColumn: 4,
            align: 'center'
        },
        {
            title: 'Цена',
            startRow: 2,
            endRow: 3,
            startColumn: 2,
            endColumn: 3
        },
        {
            title: 'Стоимость',
            startRow: 2,
            endRow: 3,
            startColumn: 3,
            endColumn: 4
        }
    ]
};

export const VirtualScrollHasMore = {
    // 70 записей. У первой записи 100 детей.
    getData: (): Array<{
        id: number,
        title: string,
        parent: number | null,
        type: boolean | null
    }> => {
        const result = [];
        const itemsCount = 70;

        result[0] = {
            id: 0,
            title: `Запись первого уровня с id = ${0}. Много дочерних элементов.`,
            parent: null,
            type: true
        };

        for (let i = 1; i < itemsCount; i++) {
            result.push(
                {
                    id: i,
                    title: `Запись первого уровня с id = ${i}. Без детей.`,
                    parent: null,
                    type: true
                },
                {
                    id: itemsCount + i,
                    title: `Запись второго уровня с id = ${itemsCount + i}`,
                    parent: 0,
                    type: null
                },
                {
                    id: itemsCount + (2 * i),
                    title: `Запись второго уровня с id = ${itemsCount + itemsCount + (2 * i)}`,
                    parent: 0,
                    type: null
                },
            );
        }

        return result.sort((a, b) => a.id > b.id ? 1 : -1);
    },
    getColumns: () => ([{
        displayProperty: 'title'
    }])
};
