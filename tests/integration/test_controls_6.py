# -*- coding: utf-8 -*-
from atf import *
from pages.index import PathSelector, PathSelectorStatic
import postgresql


@ddt
class TestPathSelector(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование PathSelector"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    def update_db(self):
        """Заполняем таблицу данными"""

        self.db = postgresql.open(self.PG_OPEN_ARG)

        # PathSelector
        self.db.execute('DELETE FROM "PathSelector";')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent@") '
                        'VALUES( 1, \'Привет\', true)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent@") '
                        'VALUES( 2, \'Пока\', true)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent@") '
                        'VALUES( 3, \'Игра\', true)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent@") '
                        'VALUES(4, \'Как дела\', true)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent", "parent@") '
                        'VALUES(5, \'Hello\', 1, true)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(6, \'Helga\', 1)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(7, \'Hola\', 1)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(8, \'Bonjour\', 1)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(9, \'Buy\', 2)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(10, \'Are vuare\', 2)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(11, \'Como esteis\', 2)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(12, \'Game\', 3)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(13, \'Gare\', 3)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(14, \'Kak dela\', 4)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(15, \'How are you\', 4)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate", "parent") '
                        'VALUES(16, \'Darova\', 5)')
        self.db.execute('INSERT INTO "PathSelector" ("@PathSelector", "translate") '
                        'VALUES(17, \'Тест\')')
        self.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"PathSelector"\', '
                        '\'@PathSelector\'), 18, false)')

    @classmethod
    def setup_class(cls):
        """Данный метод вызывается перед началом всех тестов"""

        cls.browser.open(cls.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in cls.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        log("Заполняем таблицу в БД данными")
        self.update_db()

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_pathselector.html')
        self.browser.maximize_window()

    @data(False, True)
    def test_01_render(self, value):
        """01. Тест проверки хлебного меню"""

        ps = None
        if value is False:
            ps = PathSelectorStatic(self)
        if value is True:
            ps = PathSelector(self)
            log('Переключаемся на получение данных из БД')
            ps.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ps.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Переходим в первую папку')
        ps.table.row(contains_text='Привет').click()
        assert_that(lambda: ps.table.rows_number, equal_to(4), 'Не перешли в нужную папку', and_wait())
        assert_that(lambda: ps.path_point.count_elements, equal_to(3),
                    'У меню должа быть две точки перехода и одна скрытая', and_wait())
        assert_that(lambda: ps.path_point.item(contains_text='Привет'), is_displayed(),
                    'Нет точка перехода с названием Привет', and_wait())

        log('Переходим во вторую папку')
        ps.table.row(contains_text='Hello').click()
        assert_that(lambda: ps.table.rows_number, equal_to(1), 'Не перешли в нужную папку', and_wait())
        assert_that(lambda: ps.path_point.count_elements, equal_to(4),
                    'У меню должа быть три точки перехода и одна скрытая', and_wait())
        assert_that(lambda: ps.path_point.item(contains_text='Hello'), is_displayed(),
                    'Нет точка перехода с названием Hello', and_wait())
        assert_that(lambda: ps.path_point.item(contains_text='Привет'), is_displayed(),
                    'Нет точка перехода с названием Привет', and_wait())

        log('Переходим по точке перехода в папку которая выше')
        ps.path_point.item(2).click()
        assert_that(lambda: ps.table.rows_number, equal_to(4), 'Не перешли в нужную папку', and_wait())
        assert_that(lambda: ps.path_point.count_elements, equal_to(3),
                    'У меню должа быть две точки перехода и одна скрытая', and_wait())
        assert_that(lambda: ps.path_point.item(contains_text='Привет'), is_displayed(),
                    'Нет точка перехода с названием Привет', and_wait())

        log('Переходим по точке перехода в корневую папку')
        ps.path_point.item(2).click()
        assert_that(lambda: ps.table.rows_number, equal_to(5), 'Не перешли в корневую папку', and_wait())
        assert_that(lambda: ps.path_point.count_elements, equal_to(2),
                    'У меню не должно быть точек перехода в корневой папке и две скрытых', and_wait())

if __name__ == '__main__':
    run_tests()