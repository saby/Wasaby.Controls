import * as simpleResultTpl from 'wml!Controls-demo/grid/_resources/ResultCellTemplates/Simple'
import * as numberResultTpl from 'wml!Controls-demo/grid/_resources/ResultCellTemplates/Number'
import * as countryRatingNumber from 'wml!Controls-demo/grid/_resources/CellTemplates/CountryRatingNumber'
import {constants} from 'Env/Env'
import 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksPhoto'
import 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksDescription'
import 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksReceived'


const resultCellTpl = numberResultTpl;

function getCountriesStats() {
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
                populationDensity: 30.71
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
                width: '40px',
            },
            {
                displayProperty: 'country',
                width: '300px',
            },
            {
                displayProperty: 'capital',
                width: 'max-content'
            },
            {
                displayProperty: 'population',
                width: 'max-content',
                result: 3956986345,
                resultTemplate: resultCellTpl
            },
            {
                displayProperty: 'square',
                width: 'max-content',
                result: 12423523,
                resultTemplate: resultCellTpl
            },
            {
                displayProperty: 'populationDensity',
                width: 'max-content',
                result: 5.8,
                resultTemplate: resultCellTpl
            }
        ],
        getColumnsWithAlign: () => [
            {
                displayProperty: 'number',
                width: '40px',
                align: 'right'
            },
            {
                displayProperty: 'country',
                width: '300px',
                align: 'center'
            },
            {
                displayProperty: 'capital',
                width: '1fr',
                align: 'left'
            },
            {
                displayProperty: 'population',
                width: '150px',
                align: 'right'
            },
            {
                displayProperty: 'square',
                width: '150px',
                align: 'left'
            },
            {
                displayProperty: 'populationDensity',
                width: 'max-content'
            }
        ],
        getColumnsWithValign: () => [
            {
                displayProperty: 'number',
                width: '40px',
                valign: 'right'
            },
            {
                displayProperty: 'country',
                width: '300px',
                valign: 'top'
            },
            {
                displayProperty: 'capital',
                width: '1fr',
                valign: 'bottom'
            },
            {
                displayProperty: 'population',
                width: '150px'
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
        ],
        getMultiHeader: () => [
            {
                title: '#',
                startRow: 1,
                endRow: 3,
                startColumn: 1,
                endColumn: 2
            },
            {
                title: 'Географические данные',
                startRow: 1,
                endRow: 2,
                startColumn: 2,
                endColumn: 4
            },
            {
                title: 'Страна',
                startRow: 2,
                endRow: 3,
                startColumn: 2,
                endColumn: 3
            },
            {
                title: 'Столица',
                startRow: 2,
                endRow: 3,
                startColumn: 3,
                endColumn: 4
            },
            {
                title: 'Цифры',
                startRow: 1,
                endRow: 2,
                startColumn: 4,
                endColumn: 7,
                align: 'center'
            },
            {
                title: 'Население',
                startRow: 2,
                endRow: 3,
                startColumn: 4,
                endColumn: 5
            },
            {
                title: 'Площадь км2',
                startRow: 2,
                endRow: 3,
                startColumn: 5,
                endColumn: 6
            },
            {
                title: 'Плотность населения чел/км2',
                startRow: 2,
                endRow: 3,
                startColumn: 6,
                endColumn: 7
            }
        ],
        getHeaderWithSorting: () => [
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
                title: 'Население',
                sortingProperty: 'population'
            },
            {
                title: 'Площадь км2',
                sortingProperty: 'square'
            },
            {
                title: 'Плотность населения чел/км2',
                sortingProperty: 'populationDensity'
            }
        ],
        getColumnsWithTemplate: () => [
            {
                displayProperty: 'number',
                width: 'max-content',
                template: countryRatingNumber
            },
            {
                displayProperty: 'country',
                width: '300px'
            },
            {
                displayProperty: 'capital',
                width: '100px'
            },
            {
                displayProperty: 'population',
                width: '150px'
            },
            {
                displayProperty: 'square',
                width: '150px'
            },
            {
                displayProperty: 'populationDensity',
                width: 'max-content'
            }
        ]
    }
}

function getTasks() {
    return {
        getData: () => [
            {
                id: 1,
                message: 'Регламент: Ошибка в разработку. Автор: Дубенец Д.А. Описание: (reg-chrome-presto) 3.18.150 controls - Поехала верстка кнопок когда они задизейблены prestocarry',
                fullName: 'Крайнов Дмитрий',
                photo: getImages().krainov,
                date: '6 мар',
                state: 'Review кода (нач. отдела)'
            },
            {
                id: 2,
                message: 'Регламент: Ошибка в разработку. Автор: Волчихина Л.С. Описание: Отображение колонок. При снятии галки с колонки неверная всплывающая подсказка',
                fullName: 'Крайнов Дмитрий',
                photo: getImages().krainov,
                date: '6 мар',
                state: 'Review кода (нач. отдела)'
            },
            {
                id: 3,
                message: 'Смотри надошибку. Нужно сделать тесты, чтобы так в будущем не разваливалось',
                fullName: 'Крайнов Дмитрий',
                photo: getImages().krainov,
                date: '6 мар',
                state: 'Выполнение'
            },
            {
                id: 4,
                message: 'Регламент: Ошибка в разработку. Автор: Оборевич К.А. Описание: Розница. Замечания к шрифтам в окнах Что сохранить в PDF/Excel и Что напечатать',
                fullName: 'Крайнов Дмитрий',
                photo: getImages().krainov,
                date: '12 ноя',
                state: 'Review кода (нач. отдела)'
            },
            {
                id: 5,
                message: 'Пустая строка при сканировании в упаковку Тест-онлайн adonis1/adonis123 1) Создать документ списания 2) отсканировать в него наименование/открыть РР/+Упаковка 3) Заполнить данные по упаковке/отсканировать еще 2 марки',
                fullName: 'Корбут Антон',
                photo: getImages().korbyt,
                date: '5 мар',
                state: 'Выполнение'
            },
            {
                id: 6,
                message: 'Разобраться с getViewModel - либо наследование, либо создавать модель прямо в TreeControl и передавать в BaseControl, либо ещё какой то вариант придумать.',
                fullName: 'Кесарева Дарья',
                photo: getImages().kesareva,
                date: '12 сен',
                state: 'Выполнение'
            },
            {
                id: 7,
                message: 'Научить reload обновлять табличное представление VDOM с сохранением набранных данных (например загруженных по кнопке "еще"). В данный момент есть deepReload, но он не сохраняет набранные данные.',
                fullName: 'Кесарева Дарья',
                photo: getImages().kesareva,
                date: '12 сен',
                state: 'Выполнение'
            },
            {
                id: 8,
                message: 'Лесенка на VDOM. Перевести алгоритм на предварительный расчет в модели. Сделать демку.',
                fullName: 'Кесарева Дарья',
                photo: getImages().kesareva,
                date: '12 сен',
                state: 'Выполнение'
            },
            {
                id: 9,
                message: 'Прошу сделать возможность отключения: 1) ховера на айтемах  у Controls/List, 2) курсор: поинтер',
                fullName: 'Кесарева Дарья',
                photo: getImages().kesareva,
                date: '12 сен',
                state: 'Выполнение'
            },
            {
                id: 10,
                message: 'через шаблон ячейки должна быть возможность управлять colspan (или rowspan) отдельной ячейки. <ws:partial template="standartCellTemplate" colspan="2"> типа такого если я напишу, то у меня будет ячейка на две колонки',
                fullName: 'Кесарева Дарья',
                photo: getImages().kesareva,
                date: '12 сен',
                state: 'Выполнение'
            },
            {
                id: 11,
                message: 'Не работают хлебные крошки и навигация по ним если идентификатор записи равен 0 Как повторить',
                fullName: 'Догадкин Владимир',
                photo: getImages().dogadkin,
                date: '28 фев',
                state: 'Выполнение'
            },
            {
                id: 12,
                message: 'Не работает collapse в группировке в дереве test-online.sbis.ru сталин/Сталин123',
                fullName: 'Догадкин Владимир',
                photo: getImages().dogadkin,
                date: '26 фев',
                state: 'Выполнение'
            }
        ],
        getColumns: () => [
            {
                template: 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksPhoto',
                width: '98px'
            },
            {
                template: 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksDescription',
                width: '1fr'
            },
            {
                template: 'wml!Controls-demo/grid/_resources/CellTemplates/LadderTasksReceived',
                width: 'auto'
            }
        ]
    }
}

function getImages() {
    return {
        dogadkin: constants.resourceRoot + 'Controls-demo/grid/_resources/images/dogadkin.png',
        kesareva: constants.resourceRoot + 'Controls-demo/grid/_resources/images/kesareva.png',
        korbyt: constants.resourceRoot + 'Controls-demo/grid/_resources/images/korbyt.png',
        krainov: constants.resourceRoot + 'Controls-demo/grid/_resources/images/krainov.png',
        baturina: constants.resourceRoot + 'Controls-demo/grid/_resources/images/baturina.png'
    }
}

function getPorts() {
    return {
        getData: () => [
            {
                id: 1,
                invoice: 3500,
                documentSign: 1,
                documentNum: 10,
                taxBase: 17215.00,
                document: 'б/н',
                documentDate: null,
                serviceContract: null,
                description: 'морской/речной',
                shipper: null
            },
            {
                id: 2,
                invoice: 3501,
                documentSign: 1,
                documentNum: 10,
                taxBase: 21015.00,
                document: '48000560-ABCC',
                documentDate: null,
                serviceContract: null,
                description: 'морской/речной',
                shipper: null
            },
            {
                id: 3,
                invoice: 3502,
                documentSign: 2,
                documentNum: 10,
                taxBase: 890145.04,
                document: '456990005',
                documentDate: null,
                serviceContract: null,
                description: 'ж/д, морской/речной',
                shipper: null
            }
        ],
        getColumns: () => [
            {
                width: '100px',
                displayProperty: 'invoice'
            },
            {
                width: '200px',
                displayProperty: 'documentSign'
            },
            {
                width: '200px',
                displayProperty: 'document'
            },
            {
                width: '1fr',
                displayProperty: 'description'
            },
            {
                width: '200px',
                displayProperty: 'taxBase'
            }
        ],
        getDocumentSigns: () => [
            {
                id: 1,
                title: 'ТД предусмотрено'
            },
            {
                id: 2,
                title: 'ТД не предусмотрено'
            }
        ]
    }
}
export {
    getCountriesStats,
    getTasks,
    getPorts
}