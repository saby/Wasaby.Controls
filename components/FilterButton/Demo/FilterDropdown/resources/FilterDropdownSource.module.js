define('js!SBIS3.Demo.FilterButton.FilterDropdownSource',
   [ // В массиве зависимостей подключаем требуемые файлы
      'js!WS.Data/Source/Memory' // Импортируем класс для работы со статическим источником данных
   ],
   function( // Подключенные в массиве зависимостей файлы будут доступны в следующих переменных
      MemorySource // В эту переменную импортируется класс для работы со статическим источником данных
   ){
      var items = [
               {'key': 1, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Лукьяненко', 'author_name': 'Сергей', 'work': 'Спектр'},
               {'key': 2, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Азимов', 'author_name': 'Айзек', 'work': 'Конец вечности'},
               {'key': 3, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'США', 'author': 'Мартин', 'author_name': 'Джордж', 'work': 'Песнь льда и пламени'},
               {'key': 4, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Гуляковский', 'author_name': 'Евгений', 'work': 'Обратная сторона времени'},
               {'key': 5, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Брэдбери', 'author_name': 'Рэй', 'work': '451° по Фаренгейту'},
               {'key': 6, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Лукьяненко', 'author_name': 'Сергей', 'work': 'Рыцари сорока островов'},
               {'key': 7, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Лукьяненко', 'author_name': 'Сергей', 'work': 'Джамп'},
               {'key': 8, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Желязны', 'author_name': 'Роджер', 'work': 'Хроники Амбера'},
               {'key': 9, 'genreKey': '3', 'genreName': 'мистика', 'country': 'США', 'author': 'Кинг', 'author_name': 'Стивен', 'work': 'Сияние'},
               {'key': 10, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Ливадный', 'author_name': 'Андрей', 'work': 'Грань реальности'},
               {'key': 11, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Шекли', 'author_name': 'Роберт', 'work': 'Цикл о Грегоре и Арнольде'},
               {'key': 12, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Головачев', 'author_name': 'Василий', 'work': 'Запрещенная реальность'},
               {'key': 13, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Фармер', 'author_name': 'Филип', 'work': 'Мир реки'},
               {'key': 14, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Кинг', 'author_name': 'Стивен', 'work': 'Лангольеры'},
               {'key': 15, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'Россия', 'author': 'Белянин', 'author_name': 'Андрей', 'work': 'Меч без имени'},
               {'key': 16, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'Великобритания', 'author': 'Гейман', 'author_name': 'Нил', 'work': 'Звездная пыль'},
               {'key': 17, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'Великобритания', 'author': 'Пулман', 'author_name': 'Филип', 'work': 'Темные начала'},
               {'key': 18, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Великобритания', 'author': 'Уиндем', 'author_name': 'Джон', 'work': 'День триффидов'},
               {'key': 19, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Стругацкие', 'author_name': 'Аркадий и Борис', 'work': 'Жук в муравейнике'},
               {'key': 20, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Кинг', 'author_name': 'Стивен', 'work': 'Мобильник'},
               {'key': 21, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Стругацкие', 'author_name': 'Аркадий и Борис', 'work': 'Трудно быть богом'},
               {'key': 22, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Хаксли', 'author_name': 'Олдос', 'work': 'О дивный новый мир'},
               {'key': 23, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Великобритания', 'author': 'Оруэлл', 'author_name': 'Джордж', 'work': '1984'},
               {'key': 24, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Стругацкие', 'author_name': 'Аркадий и Борис', 'work': 'Улитка на склоне'},
               {'key': 25, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Лукьяненко', 'author_name': 'Сергей', 'work': 'Лабиринт отражений'},
               {'key': 26, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Гуляковский', 'author_name': 'Евгений', 'work': 'Сезон туманов'},
               {'key': 27, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Великобритания', 'author': 'Уиндем', 'author_name': 'Джон', 'work': 'Отклонение от нормы'},
               {'key': 28, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Гаррисон', 'author_name': 'Гарри', 'work': 'Неукротимая планета'},
               {'key': 29, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'Россия', 'author': 'Фрай', 'author_name': 'Макс', 'work': 'Лабиринты Ехо'},
               {'key': 30, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'Россия', 'author': 'Волков', 'author_name': 'Сергей', 'work': 'Стража последнего рубежа'},
               {'key': 31, 'genreKey': '2', 'genreName': 'фэнтези', 'country': 'Россия', 'author': 'Бадей', 'author_name': 'Сергей', 'work': 'Свободный полет'},
               {'key': 32, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Дик', 'author_name': 'Филип', 'work': 'Мечтают ли андроиды об электроовцах?'},
               {'key': 33, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Кинг', 'author_name': 'Стивен', 'work': 'Долгий джонт'},
               {'key': 34, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Симмонс', 'author_name': 'Дэн', 'work': 'Гиперион'},
               {'key': 35, 'genreKey': '1', 'genreName': 'фантастика', 'country': 'США', 'author': 'Герберт', 'author_name': 'Фрэнк', 'work': 'Дюна'},
               {'key': 36, 'genreKey': '3', 'genreName': 'мистика', 'country': 'Россия', 'author': 'Булгаков', 'author_name': 'Михаил', 'work': 'Мастер и Маргарита'},
               {'key': 37, 'genreKey': '3', 'genreName': 'мистика', 'country': 'Россия', 'author': 'Гоголь', 'author_name': 'Николай', 'work': 'Вий'},
               {'key': 38, 'genreKey': '3', 'genreName': 'мистика', 'country': 'США', 'author': 'Кинг', 'author_name': 'Стивен', 'work': 'Зеленая миля'}
      ];
      return new MemorySource({
         data: items, // Передаём в качестве данных созданный массив
         idProperty: 'key' // Устанавливаем поле первичного ключа
      });
   }
);
