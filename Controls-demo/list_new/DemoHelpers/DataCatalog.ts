function getFewCategories(): Array<{
    id: number,
    title: string,
    description: string,
    byDemand?: string,
    tplPath?: string
}> {
    return [
        {
            id: 1,
            title: 'Notebooks',
            description: 'Trusted Reviews ranks all your top laptop and notebook options, whether you want a ...',
            byDemand: 'Popular',
            tplPath: 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight'
        },
        {
            id: 2,
            title: 'Tablets',
            byDemand: 'Unpopular',
            description: 'Tablets are great for playing games, reading, homework, keeping kids entertained in the back seat of the car'
        },
        {
            id: 3,
            title: 'Laptop computers',
            description: 'Explore PCs and laptops to discover the right device that powers all that you do',
            byDemand: 'Unpopular',
            tplPath: 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateWithDescription'
        },
        {
            id: 4,
            title: 'Apple gadgets',
            description: 'Explore new Apple accessories for a range of Apple products',
            byDemand: 'Average demand',
            tplPath: 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateNoHighlight'
        },
        {
            id: 5,
            title: 'Android gadgets',
            description: 'These 25 clever phone accessories and Android-compatible gadgets',
            byDemand: 'Popular',
            tplPath: 'wml!Controls-demo/list_new/ItemTemplate/ItemTemplateProperty/itemTemplateWithDescription'
        }
    ]
}

function getGroupedCatalog(): Array<{
    id: number
    title: string
    brand: string
    longBrandName?: string
}> {
    return [
        {
            id: 1,
            title: 'MacBook Pro',
            brand: 'apple'
        },
        {
            id: 2,
            title: 'ASUS X751SA-TY124D',
            brand: 'asus'
        },
        {
            id: 3,
            title: 'HP 250 G5 (W4N28EA)',
            brand: 'hp'
        },
        {
            id: 4,
            title: 'Apple iPad Pro 2016',
            brand: 'apple'
        },
        {
            id: 5,
            title: 'ACER One 10 S1002-15GT',
            brand: 'acer'
        },
        {
            id: 6,
            title: 'ASUS X541SA-XO056D',
            brand: 'asus'
        },
        {
            id: 7,
            title: 'iPhone X Max',
            brand: 'apple'
        },
        {
            id: 8,
            title: 'ASUS Zenbook F-234',
            brand: 'asus',
            longBrandName: 'AsusTek Computer Inc. stylised as ASUSTeK (Public TWSE: 2357 LSE: ASKD), based in Beitou District, Taipei, Taiwan'
        },
        {
            id: 9,
            title: 'ACER Aspire F 15 F5-573G-51Q7',
            brand: 'acer'
        }
    ]
}

function getGroupedCatalogWithHiddenGroup(): Array<{
    id: number
    title: string
    brand?: string
}> {
    return [
        {
            id: 1,
            title: 'WebCam X541SA-XO056D'
        },
        {
            id: 2,
            title: 'MacBook Pro',
            brand: 'apple'
        },
        {
            id: 3,
            title: 'ASUS X751SA-TY124D',
            brand: 'asus'
        },
        {
            id: 4,
            title: 'HP 250 G5 (W4N28EA)',
            brand: 'hp'
        },
        {
            id: 5,
            title: 'Apple iPad Pro 2016',
            brand: 'apple'
        },
        {
            id: 6,
            title: 'KeyBoard 5RTX-zxs',
            brand: 'unknown'
        },
        {
            id: 7,
            title: 'MagicMouse 2',
        },
        {
            id: 8,
            title: 'iPhone X Max',
            brand: 'apple'
        },
        {
            id: 9,
            title: 'ASUS Zenbook F-234',
            brand: 'asus'
        }
    ];
}

export {
    getFewCategories,
    getGroupedCatalog,
    getGroupedCatalogWithHiddenGroup
}