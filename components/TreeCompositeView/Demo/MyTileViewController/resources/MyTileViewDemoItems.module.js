define('js!SBIS3.CONTROLS.MyTileViewDemoItems',[], function () {
    'use strict';

    return  {
        list: [
            {width: 120, 'title': 'Оранджевый кабриолет', 'id':2, 'image': 'http://babadu.ru/upload/iblock/935/welly_porshe_911_1_24.jpg', withTitle: false},
            {width: 180, 'title': 'Белый кабриолет', 'id':3, 'image': 'http://avto-russia.ru/autos/bmw/photo/bmw_m3_cabrio_1280x1024.jpg', withTitle: false},
            {width: 240, 'title': 'Чёрный кабриолет с очень длинным названием модели что даже нет смысла её писать, потому что она всё равно не влезет', 'id':4, 'image': 'http://ya.clan.su/_ph/11/773783715.jpg?1468871741', withTitle: true},
            {width: 70, 'title': 'Синий кабриолет', 'id':5, 'image': 'https://thumbs.dreamstime.com/z/%D0%B3%D0%BE-%D1%83%D0%B1%D0%B0%D1%8F-%D1%83%D0%B7%D0%BA%D0%B0%D1%8F-%D0%B8-%D0%B2%D1%8B%D1%81%D0%BE%D0%BA%D0%B0%D1%8F-%D1%81%D1%82%D0%B5%D0%BA-%D1%8F%D0%BD%D0%BD%D0%B0%D1%8F-%D0%B1%D1%83%D1%82%D1%8B-%D0%BA%D0%B0-38201581.jpg', withTitle: true},
            {width: 260, 'title': 'Белый кабриолет', 'id':6, 'image': 'https://im2-tub-ru.yandex.net/i?id=cca14557bc9736b5e0f5f1f47fa2c5aa&n=33&h=215&w=382', withTitle: false},
            {width: 200, 'title': 'Красный кабриолет с таким же длинным названием модели, как у чёрного кабриолета', 'id':7, 'image': 'http://img7.autonavigator.ru/carsfoto/1600/15711/246162/Ferrari_California_Coupe-Cabriolet_2014.jpg', withTitle: false},
            {width: 260, 'title': 'Серебряный кабриолет', 'id':8,'image': 'http://carrrs.com/wp-content/uploads/2015/12/333.jpg', withTitle: false},
            {width: 200, 'title': 'Серебряный кабриолет', 'id':9, 'image': 'http://333v.ru/uploads/1c/1c0fa3e9cb64e010070c23bb8a02b6dc.jpg', withTitle: false},
            {width: 200, 'title': 'Жёлтый кабриолет', 'id':10, 'image': 'http://fotoham.ru/img/picture/Oct/08/d060b50db3d6fe25bd48c0ba2484e60d/1.jpg', withTitle: false}
            /*{'title': 'Красный кабриолет', 'id':11, 'image': 'http://s1.1zoom.ru/big3/339/337021-svetik.jpg', withTitle: false}*/],
        hierarhy: [
            {width: 120, 'title': 'Белые кабриолеты и не только', 'id':1, 'parent@': true, 'parent': null, 'image': 'http://333v.ru/uploads/1c/1c0fa3e9cb64e010070c23bb8a02b6dc.jpg'},
            {width: 180, 'title': 'Красные кабриолеты', 'id':2, 'parent@': true, 'parent': null, 'image': 'http://333v.ru/uploads/1c/1c0fa3e9cb64e010070c23bb8a02b6dc.jpg'},
            {width: 200, 'title': 'Белый кабриолет', 'id':3, 'parent@': null, 'parent': 1, 'image': 'http://333v.ru/uploads/1c/1c0fa3e9cb64e010070c23bb8a02b6dc.jpg'},
            {width: 120, 'title': 'Оранджевый кабриолет', 'id':4, 'parent@': null, 'parent': null,  'image': 'http://babadu.ru/upload/iblock/935/welly_porshe_911_1_24.jpg'},
            {width: 180, 'title': 'Белый кабриолет', 'id':5, 'parent@': null, 'parent': 1,  'image': 'http://avto-russia.ru/autos/bmw/photo/bmw_m3_cabrio_1280x1024.jpg'},
            {width: 240, 'title': 'Чёрный кабриолет с очень длинным названием модели что даже нет смысла её писать, потому что она всё равно не влезет', 'id':6, 'parent@': null, 'parent': null,  'image': 'http://ya.clan.su/_ph/11/773783715.jpg?1468871741', withTitle: true},
            {width: 260, 'title': 'Синий кабриолет', 'id':7, 'parent@': null, 'parent': null,  'image': 'http://wallpapershome.ru/images/pages/ico_h/6948.jpg'},
            {width: 260, 'title': 'Белый кабриолет', 'id':8, 'parent@': null, 'parent': null,  'image': 'https://im2-tub-ru.yandex.net/i?id=cca14557bc9736b5e0f5f1f47fa2c5aa&n=33&h=215&w=382'},
            {width: 200, 'title': 'Красный кабриолет', 'id':9, 'parent@': null, 'parent': 2,  'image': 'http://img7.autonavigator.ru/carsfoto/1600/15711/246162/Ferrari_California_Coupe-Cabriolet_2014.jpg'},
            {width: 260, 'title': 'Серебряный кабриолет', 'id':10, 'parent@': null, 'parent': null,  'image': 'http://carrrs.com/wp-content/uploads/2015/12/333.jpg', withTitle: true},
            {width: 200, 'title': 'Серебряный кабриолет', 'id':11, 'parent@': null, 'parent': null,  'image': 'http://333v.ru/uploads/1c/1c0fa3e9cb64e010070c23bb8a02b6dc.jpg', withTitle: true},
            {width: 200, 'title': 'Жёлтый кабриолет', 'id':12, 'parent@': null, 'parent': null,  'image': 'http://fotoham.ru/img/picture/Oct/08/d060b50db3d6fe25bd48c0ba2484e60d/1.jpg', withTitle: true},
            {width: 200, 'title': 'Красный кабриолет', 'id':13, 'parent@': null, 'parent': 2,  'image': 'http://s1.1zoom.ru/big3/339/337021-svetik.jpg'}]
    };
});