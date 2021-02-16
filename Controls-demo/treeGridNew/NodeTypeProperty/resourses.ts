export interface IData {
    id: number;
    title: string;
    count: string;
    price: string;
    price1: string;
    price2: string;
    tax: string;
    price3: string;
    parent: number;
    type: boolean;
    hasChild: boolean;
    nodeType: string;
}

export const data: IData[] =  [
    {
        id: 1,
        title: 'Товары и материалы',
        count: '',
        price: '',
        price1: '168520',
        price2: '',
        tax: '',
        price3: '218520',
        parent: null,
        type: true,
        hasChild: true,
        nodeType: 'group'
    },
    {
        id: 11,
        title: 'Сервер SL2500/4UT8G2',
        count: '1 шт',
        price: '1180657',
        price1: '97700',
        price2: '16587',
        tax: '18',
        price3: '997700',
        parent: 1,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 12,
        title: 'ПО Антивирус Dr. Web',
        count: '99 шт',
        price: '997',
        price1: '1260',
        price2: '226',
        tax: '18',
        price3: '126000',
        parent: 1,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 13,
        title: 'Конфеты Raffaello 175 гр.',
        count: '27 шт',
        price: '87',
        price1: '99',
        price2: '17',
        tax: '18',
        price3: '1230',
        parent: 1,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 14,
        title: 'Устройство хранения USB',
        count: '9 шт',
        price: '116',
        price1: '158',
        price2: '23',
        tax: '18',
        price3: '1488',
        parent: 1,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 2,
        title: 'Услуги и работы',
        count: '',
        price: '',
        price1: '700',
        price2: '',
        tax: '',
        price3: '1488',
        parent: null,
        type: true,
        hasChild: true,
        nodeType: 'group'
    },
    {
        id: 21,
        title: 'Подключение интернета',
        count: '2 ч',
        price: '',
        price1: '700',
        price2: '41',
        tax: '18',
        price3: '1400',
        parent: 2,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 3,
        title: 'Неисключительные права',
        count: '',
        price: '',
        price1: '1318300',
        price2: '',
        tax: '',
        price3: '1318300',
        parent: null,
        type: true,
        hasChild: true,
        nodeType: 'group'
    },
    {
        id: 31,
        title: 'Права использования "СБИС ЭО-Базовый, Бюджет"',
        count: '1 шт',
        price: '1204500',
        price1: '1304500',
        price2: '197400',
        tax: '18',
        price3: '1304500',
        parent: 3,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 32,
        title: 'Права использования аккаунта sbis.ru в течение 1 года',
        count: '1 шт',
        price: '4500',
        price1: '4500',
        price2: '984',
        tax: '18',
        price3: '4500',
        parent: 3,
        type: null,
        hasChild: false,
        nodeType: null
    },
    {
        id: 33,
        title: 'Права использования "СБИС Расширенный аналитический блок"',
        count: '1 шт',
        price: '9800',
        price1: '9800',
        price2: '1447',
        tax: '18',
        price3: '9800',
        parent: 3,
        type: null,
        hasChild: false,
        nodeType: null
    }
];
