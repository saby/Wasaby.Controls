function getCountriesStats(): {
    getData: any,
    getColumnsWithoutWidths: any
    getColumnsWithWidths: any
    getDefaultHeader
} {
    return {
        getData: () => [
            {
                id: 0,
                number: 1,
                country: 'Россия',
                capital: 'Москва',
                population: 143420300,
                square: 17075200,
                populationDensity: 8
            },
            {
                id: 1,
                number: 2,
                country: 'Канада',
                capital: 'Оттава',
                population: 32805000,
                square: 9976140,
                populationDensity: 3
            },
            {
                id: 2,
                number: 3,
                country: 'Соединенные Штаты Америки',
                capital: 'Вашингтон',
                population: 295734100,
                square: 9629091,
                populationDensity: 3071
            },
            {
                id: 3,
                number: 4,
                country: 'Китай',
                capital: 'Пекин',
                population: 1306313800,
                square: 9596960,
                populationDensity: 136.12
            },
            {
                id: 4,
                number: 5,
                country: 'Бразилия',
                capital: 'Бразилиа',
                population: 186112800,
                square: 8511965,
                populationDensity: 21.86
            },
            {
                id: 5,
                number: 6,
                country: 'Австралия',
                capital: 'Канберра',
                population: 20090400,
                square: 7686850,
                populationDensity: 3
            },
            {
                id: 6,
                number: 7,
                country: 'Индия',
                capital: 'Нью-Дели',
                population: 1080264400,
                square: 3287590,
                populationDensity: 328.59
            },
            {
                id: 7,
                number: 8,
                country: 'Аргентина',
                capital: 'Буэнос-Айрес',
                population: 39537900,
                square: 2766890,
                populationDensity: 4.29
            },
            {
                id: 8,
                number: 9,
                country: 'Казахстан',
                capital: 'Нур-Султан (бывш. Астана)',
                population: 15185000,
                square: 2717300,
                populationDensity: 6.00
            },
            {
                id: 9,
                number: 10,
                country: 'Судан',
                capital: 'Хартум',
                population: 40187500,
                square: 2505810,
                populationDensity: 16.04
            },
            {
                id: 10,
                number: 11,
                country: 'Алжир',
                capital: 'Алжир',
                population: 32531900,
                square: 2381740,
                populationDensity: 13.66
            },
            {
                id: 11,
                number: 12,
                country: 'Конго',
                capital: 'Браззавиль',
                population: 60085800,
                square: 2345410,
                populationDensity: 25.62
            },
            {
                id: 12,
                number: 13,
                country: 'Мексика',
                capital: 'Мехико',
                population: 106202900,
                square: 1972550,
                populationDensity: 53.84
            },
            {
                id: 13,
                number: 14,
                country: 'Саудовская Аравия',
                capital: 'Эр-Рияд',
                population: 26417600,
                square: 1960582,
                populationDensity: 13.47
            },
            {
                id: 14,
                number: 15,
                country: 'Индонезия',
                capital: 'Джакарта',
                population: 241973900,
                square: 1919440,
                populationDensity: 126.06
            },
            {
                id: 15,
                number: 16,
                country: 'Ливия',
                capital: 'Триполи',
                population: 5765600,
                square: 1759540,
                populationDensity: 3.00
            },
            {
                id: 16,
                number: 17,
                country: 'Иран',
                capital: 'Тегеран',
                population: 68017900,
                square: 1648000,
                populationDensity: 41.27
            },
            {
                id: 17,
                number: 18,
                country: 'Монголия',
                capital: 'Улан-Батор',
                population: 2791300,
                square: 1565000,
                populationDensity: 2.00
            },
            {
                id: 18,
                number: 19,
                country: 'Перу',
                capital: 'Лима',
                population: 27925600,
                square: 1285220,
                populationDensity: 21.73
            }
        ],
        getColumnsWithoutWidths: () => [
            {
                displayProperty: 'number',
            },
            {
                displayProperty: 'country',
            },
            {
                displayProperty: 'capital',
            },
            {
                displayProperty: 'population',
            },
            {
                displayProperty: 'square',
            },
            {
                displayProperty: 'populationDensity',
            }
        ],
        getColumnsWithWidths: () => [
            {
                displayProperty: 'number',
                width: 'max-content'
            },
            {
                displayProperty: 'country',
                width: 'minmax(max-content, 1fr)',
            },
            {
                displayProperty: 'capital',
                width: 'minmax(max-content, 300px)'

            },
            {
                displayProperty: 'population',
                width: 'max-content'
            },
            {
                displayProperty: 'square',
                width: 'max-content'
            },
            {
                displayProperty: 'populationDensity',
                width: 'max-content'
            }
        ],
        getDefaultHeader: () => [
            {
                title: '#'
            },
            {
                title: 'Страна'
            },
            {
                title: 'Столица'
            },
            {
                title: 'Население'
            },
            {
                title: 'Площадь км2'
            },
            {
                title: 'Плотность населения чел/км2'
            }
        ]
    }
}

export {
    getCountriesStats
}