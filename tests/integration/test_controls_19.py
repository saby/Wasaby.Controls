# -*- coding: utf-8 -*-
from atf import *
from pages.index import CompositeViewListAndTile, CompositeViewListAndTileStatic
import postgresql


@ddt
class TestCompositeViewList(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование CompositeView List"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    def update_table_view(self):
        """Обновление данных в таблицах"""

        self.db = postgresql.open(self.PG_OPEN_ARG)

        # CompositeViewList
        self.db.execute('DELETE FROM "CompositeViewList";')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent@") '
                        'VALUES( 1, \'Привет\', true)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent@") '
                        'VALUES( 2, \'Пока\', true)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent@") '
                        'VALUES( 3, \'Игра\', true)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent@") '
                        'VALUES(4, \'Как дела\', true)')
        self.db.execute('INSERT INTO "CompositeViewList" '
                        '("@CompositeViewList", "translate", "parent", "parent@") '
                        'VALUES(5, \'Hello\', 1, true)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(6, \'Helga\', 1)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(7, \'Hola\', 1)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(8, \'Bonjour\', 1)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(9, \'Buy\', 2)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(10, \'Are vuare\', 2)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(11, \'Como esteis\', 2)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(12, \'Game\', 3)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(13, \'Gare\', 3)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(14, \'Kak dela\', 4)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(15, \'How are you\', 4)')
        self.db.execute('INSERT INTO "CompositeViewList" ("@CompositeViewList", "translate", "parent") '
                        'VALUES(16, \'Darova\', 5)')
        self.db.execute('INSERT INTO "CompositeViewList" '
                        '("@CompositeViewList", "translate") VALUES(17, \'Тест\')')
        self.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"CompositeViewList"\', '
                        '\'@CompositeViewList\'), 18, false)')

    @classmethod
    def setup_class(cls):

        cls.browser.open(cls.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in cls.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        log("Заполняем таблицу данными")
        self.update_table_view()

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_compositeview_list.html')
        self.browser.maximize_window()

    @data(False, True)
    def test_01_render(self, value):
        """01. Тест проверки отображения composite view list"""

        page = None
        if value is False:
            page = CompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = CompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.composite_view, is_displayed(), 'Страница не загрузилась', and_wait())

        assert_that(lambda: page.items_clst.count_elements, equal_to(17),
                    'В контроле неверное колличество записей', and_wait())

        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Buy', 'Are vuare',
                'Como esteis', 'Game', 'Gare', 'Kak dela', 'How are you', 'Darova']
        for node in root:
            assert_that(page.items_clst.item(with_text=node), is_displayed(),
                        'Нет нужной записи - %s в CompositeView' % node, and_wait())

    @data(False, True)
    def test_02_delete_folder(self, value):
        """02. Тест проверки удаления папки в composite view list"""

        page = None
        if value is False:
            page = CompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = CompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.composite_view, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем запись')
        page.items_clst.item(contains_text='Are vuare').mouse_over()
        assert_that(page.delete_item_btn, is_displayed(), 
                    'Панель операций над записью не появилась', and_wait())
        page.delete_item_btn.click()
        assert_that(page.no_btn, is_displayed(), 
                    'Диалог подтверждения удаления записи не появился', and_wait())
        page.yes_btn.click()
        assert_that(page.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления запииси не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: page.items_clst.count_elements, equal_to(16),
                    'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Buy',
                'Como esteis', 'Game', 'Kak dela', 'How are you', 'Darova']
        for node in root:
            assert_that(page.items_clst.item(contains_text=node), is_displayed(),
                        'Нет нужной записи %s в CompositeView' % node, and_wait())

        wrong_root = ['Are vuare']
        for node in wrong_root:
            assert_that(lambda: page.items_clst.item(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная запись - %s есть в CompositeView' % node, and_wait())

if __name__ == '__main__':
    run_tests()