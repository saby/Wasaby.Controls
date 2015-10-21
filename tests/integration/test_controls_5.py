# -*- coding: utf-8 -*-
from atf import *
from pages.index import TreeDataGrid, TreeDataGridStatic
import postgresql


@ddt
class TestTreeDataGrid(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование TreeDataGrid"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    def update_db(self):
        """Заполняем таблицу данными"""

        self.db = postgresql.open(self.PG_OPEN_ARG)

        # TreeDataGrid
        self.db.execute('DELETE FROM "TreeDataGrid";')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent@") '
                        'VALUES( 1, \'Привет\', true)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent@") '
                        'VALUES( 2, \'Пока\', true)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent@") '
                        'VALUES( 3, \'Игра\', true)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent@") '
                        'VALUES(4, \'Как дела\', true)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent", "parent@") '
                        'VALUES(5, \'Hello\', 1, true)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(6, \'Helga\', 1)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(7, \'Hola\', 1)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(8, \'Bonjour\', 1)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(9, \'Buy\', 2)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(10, \'Are vuare\', 2)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(11, \'Como esteis\', 2)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(12, \'Game\', 3)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(13, \'Gare\', 3)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(14, \'Kak dela\', 4)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(15, \'How are you\', 4)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate", "parent") '
                        'VALUES(16, \'Darova\', 5)')
        self.db.execute('INSERT INTO "TreeDataGrid" ("@TreeDataGrid", "translate") '
                        'VALUES(17, \'Тест\')')
        self.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"TreeDataGrid"\', '
                        '\'@TreeDataGrid\'), 18, false)')

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
        self.browser.open(self.config.SITE + '/integration_treedatagrid.html')
        self.browser.maximize_window()

    @data(False, True)
    def test_01_render(self, value):
        """01. Тест проверки отображения tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())
        
        log('Проверяем, что загрузка данных произошла успешно')
        assert_that(lambda: tdg.table.rows_number, equal_to(5), 'В TreeDataGrid загрузились не все данные', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_02_expand(self, value):
        """02. Тест проверки раскрытия папки tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Расскрываем папку нажатием по треугольнику')
        tdg.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()

        log('Проверяем, что папка раскрылась')
        assert_that(lambda: tdg.table.rows_number, equal_to(10), 'Папка не раскрылась', and_wait())

        root = ['Привет', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        log('Расскрываем вложенную в папку')
        tdg.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()

        log('Проверяем, что папка раскрылась')
        assert_that(lambda: tdg.table.rows_number, equal_to(12), 'Папка не раскрылась', and_wait())

        root = ['Привет', 'Hello', 'Darova', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_03_collapse(self, value):
        """03. Тест проверки свертывания папки tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Расскрываем нужные папки нажатием по треугольнику')
        tdg.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        tdg.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()
        assert_that(lambda: tdg.table.rows_number, equal_to(12), 'Одна из папок не расскрылась', and_wait())

        log('Закрываем папку и проверяем, что она закрылась')
        tdg.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()
        assert_that(lambda: tdg.table.rows_number, equal_to(10), 'Папка Hello не закрылась', and_wait())

        root = ['Привет', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Darova']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

        log('Закрываем еще одну папку и проверяем, что она закрылась')
        tdg.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        assert_that(lambda: tdg.table.rows_number, equal_to(5), 'Папка Привет не закрылась', and_wait())

        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Darova', 'Hello', 'Helga', 'Hola', 'Bonjour']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_04_delete_folder(self, value):
        """04. Тест проверки удаления папки в tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем папку')
        tdg.table.row(contains_text='Привет').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(4),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Привет']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_05_delete_node(self, value):
        """05. Тест проверки удаления записи в tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем запись')
        tdg.table.row(contains_text='Тест').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(4),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Тест']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_06_delete_node_in_folder(self, value):
        """06. Тест проверки удаления записи в папке tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        tdg.table.row(contains_text='Привет').click()

        log('Удаляем запись')
        tdg.table.row(contains_text='Helga').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(3),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Hello', 'Hola', 'Bonjour']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Helga']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_07_delete_folder_in_folder(self, value):
        """07. Тест проверки удаления папки в папке tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        tdg.table.row(contains_text='Привет').click()
        assert_that(tdg.table.row(contains_text='Hello'), is_displayed(), 'Папка не раскрылась', and_wait())

        log('Удаляем папку')
        tdg.table.row(contains_text='Hello').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(3),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Helga', 'Hola', 'Bonjour']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Hello']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_08_delete_folder_in_expand(self, value):
        """08. Тест проверки удаления папки при раскрытии другой папки в tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Раскрываем папку')
        tdg.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()

        log('Удаляем папку')
        tdg.table.row(contains_text='Hello').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(6),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Hello']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

    @data(False, True)
    def test_09_delete_node_in_expand(self, value):
        """09. Тест проверки удаления узла при раскрытии другой папки в tree data grid"""

        tdg = None
        if value is False:
            tdg = TreeDataGridStatic(self)
        if value is True:
            tdg = TreeDataGrid(self)
            log('Переключаемся на получение данных из БД')
            tdg.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tdg.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем запись')
        tdg.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        tdg.table.row(contains_text='Hola').mouse_over()
        assert_that(tdg.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tdg.delete_item_btn.click()
        assert_that(tdg.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tdg.yes_btn.click()
        assert_that(tdg.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: tdg.table.rows_number, equal_to(6),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tdg.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeDataGrid' % node, and_wait())

        wrong_root = ['Hola']
        for node in wrong_root:
            assert_that(lambda: tdg.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeDataGrid' % node, and_wait())

if __name__ == '__main__':
    run_tests()