# -*- coding: utf-8 -*-
from atf import *
from pages.index import TreeCompositeViewListAndTile, TreeCompositeViewListAndTileStatic
import postgresql


@ddt
class TestTreeCompositeViewList(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование TreeCompositeView List"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    def update_table_view(self):
        """Обновление данных в таблицах"""

        self.db = postgresql.open(self.PG_OPEN_ARG)

        # TreeCompositeViewList
        self.db.execute('DELETE FROM "TreeCompositeViewList";')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent@") '
                        'VALUES( 1, \'Привет\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent@") '
                        'VALUES( 2, \'Пока\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent@") '
                        'VALUES( 3, \'Игра\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent@") '
                        'VALUES(4, \'Как дела\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" '
                        '("@TreeCompositeViewList", "translate", "parent", "parent@") '
                        'VALUES(5, \'Hello\', 1, true)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(6, \'Helga\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(7, \'Hola\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(8, \'Bonjour\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(9, \'Buy\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(10, \'Are vuare\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(11, \'Como esteis\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(12, \'Game\', 3)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(13, \'Gare\', 3)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(14, \'Kak dela\', 4)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(15, \'How are you\', 4)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" ("@TreeCompositeViewList", "translate", "parent") '
                        'VALUES(16, \'Darova\', 5)')
        self.db.execute('INSERT INTO "TreeCompositeViewList" '
                        '("@TreeCompositeViewList", "translate") VALUES(17, \'Тест\')')
        self.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"TreeCompositeViewList"\', '
                        '\'@TreeCompositeViewList\'), 18, false)')

    @classmethod
    def setup_class(cls):

        cls.browser.open(cls.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in cls.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        log("Заполняем таблицу данными")
        self.update_table_view()

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_treecompositeview_list.html')
        self.browser.maximize_window()

    @data(False, True)
    def test_01_render(self, value):
        """01. Тест проверки отображения hierarchy multi view list"""

        page = None
        if value is False:
            page = TreeCompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = TreeCompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.multi_view, is_displayed(), 'Страница не загрузилась', and_wait())

        assert_that(lambda: page.folders_clst.count_elements, equal_to(4),
                    'В контроле неверное колличество папок', and_wait())
        assert_that(lambda: page.lists_clst.count_elements, equal_to(1),
                    'В контроле неверное колличество записей', and_wait())

        root = ['Привет', 'Пока', 'Игра', 'Как дела']
        for node in root:
            assert_that(page.folders_clst.item(contains_text=node), is_displayed(),
                        'Нет нужной папки - %s в TreeCompositeView' % node, and_wait())

        root = ['Тест']
        for node in root:
            assert_that(page.lists_clst.item(contains_text=node), is_displayed(),
                        'Нет нужной записи - %s в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_02_delete_folder(self, value):
        """02. Тест проверки удаления папки в hierarchy multi view list"""

        page = None
        if value is False:
            page = TreeCompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = TreeCompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.multi_view, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем запись')
        page.folders_clst.item(contains_text='Привет').mouse_over()
        assert_that(page.delete_item_btn, is_displayed(), 
                    'Панель операций над папкой(записью) не появилась', and_wait())
        page.delete_item_btn.click()
        assert_that(page.no_btn, is_displayed(), 
                    'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        page.yes_btn.click()
        assert_that(page.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: page.folders_clst.count_elements, equal_to(3),
                    'Кол-во папок не соответствует желаемому', and_wait())
        assert_that(lambda: page.lists_clst.count_elements, equal_to(1),
                    'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Пока', 'Игра', 'Как дела']
        for node in root:
            assert_that(page.folders_clst.item(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Привет']
        for node in wrong_root:
            assert_that(lambda: page.folders_clst.item(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка - %s есть в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_03_delete_node(self, value):
        """03. Тест проверки удаления узла в hierarchy multi view list"""

        page = None
        if value is False:
            page = TreeCompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = TreeCompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.multi_view, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        page.lists_clst.item(contains_text='Тест').mouse_over()
        assert_that(page.delete_item_btn, is_displayed(), 
                    'Панель операций над папкой(записью) не появилась', and_wait())
        page.delete_item_btn.click()
        assert_that(page.no_btn, is_displayed(), 
                    'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        page.yes_btn.click()
        assert_that(page.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: page.folders_clst.count_elements, equal_to(4),
                    'Кол-во папок не соответствует желаемому', and_wait())
        assert_that(lambda: page.lists_clst.count_elements, equal_to(0),
                    'Кол-во записей не соответствует желаемому', and_wait())

        wrong_root = ['Тест']
        for node in wrong_root:
            assert_that(lambda: page.lists_clst.item(contains_text=node).is_displayed is False, is_(True),
                        'Не нужный запись - %s есть в TreeCompositeView' % node, and_wait())
            
    @data(False, True)
    def test_04_delete_node_in_folder(self, value):
        """04. Тест проверки удаления узла в папке hierarchy multi view list"""

        page = None
        if value is False:
            page = TreeCompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = TreeCompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.multi_view, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        page.folders_clst.item(contains_text='Привет').click()

        log('Удаляем запись')
        page.lists_clst.item(contains_text='Helga').mouse_over()
        assert_that(page.delete_item_btn, is_displayed(), 
                    'Панель операций над папкой(записью) не появилась', and_wait())
        page.delete_item_btn.click()
        assert_that(page.no_btn, is_displayed(), 
                    'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        page.yes_btn.click()
        assert_that(page.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: page.folders_clst.count_elements, equal_to(1),
                    'Кол-во папок не соответствует желаемому', and_wait())
        assert_that(lambda: page.lists_clst.count_elements, equal_to(2),
                    'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Hola', 'Bonjour']
        for node in root:
            assert_that(page.lists_clst.item(contains_text=node), is_displayed(),
                        'Нет нужной записи - %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Helga']
        for node in wrong_root:
            assert_that(lambda: page.lists_clst.item(contains_text=node).is_displayed is False, is_(True),
                        'Не нужный запись - %s есть в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_05_delete_folder_in_folder(self, value):
        """05. Тест проверки удаления папки в папке hierarchy multi view list"""

        page = None
        if value is False:
            page = TreeCompositeViewListAndTileStatic(self)
        if value is True:
            log('Переключаем на данные из БД')
            page = TreeCompositeViewListAndTile(self)
            page.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(page.multi_view, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        page.folders_clst.item(contains_text='Привет').click()

        log('Удаляем запись')
        page.folders_clst.item(contains_text='Hello').mouse_over()
        assert_that(page.delete_item_btn, is_displayed(),
                    'Панель операций над папкой(записью) не появилась', and_wait())
        page.delete_item_btn.click()
        assert_that(page.no_btn, is_displayed(),
                    'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        page.yes_btn.click()
        assert_that(page.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: page.folders_clst.count_elements, equal_to(0),
                    'Кол-во паок не соответствует желаемому', and_wait())
        assert_that(lambda: page.lists_clst.count_elements, equal_to(3),
                    'Кол-во записей не соответствует желаемому', and_wait())

        wrong_root = ['Hello']
        for node in wrong_root:
            assert_that(lambda: page.folders_clst.item(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка - %s есть в TreeCompositeView' % node, and_wait())

if __name__ == '__main__':
    run_tests()