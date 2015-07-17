# -*- coding: utf-8 -*-
from atf import *
from pages.index import TreeCompositeView, TreeCompositeViewStatic
import postgresql


@ddt
class TestTreeCompositeViewTable(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование TreeCompositeView Table"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    def update_table_view(self):
        """Обновление данных в таблицах"""

        self.db = postgresql.open(self.PG_OPEN_ARG)

        # TreeCompositeViewTable
        self.db.execute('DELETE FROM "TreeCompositeViewTable";')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent@") '
                        'VALUES( 1, \'Привет\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent@") '
                        'VALUES( 2, \'Пока\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent@") '
                        'VALUES( 3, \'Игра\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent@") '
                        'VALUES(4, \'Как дела\', true)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" '
                        '("@TreeCompositeViewTable", "translate", "parent", "parent@") '
                        'VALUES(5, \'Hello\', 1, true)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(6, \'Helga\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(7, \'Hola\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(8, \'Bonjour\', 1)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(9, \'Buy\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(10, \'Are vuare\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(11, \'Como esteis\', 2)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(12, \'Game\', 3)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(13, \'Gare\', 3)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(14, \'Kak dela\', 4)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(15, \'How are you\', 4)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" ("@TreeCompositeViewTable", "translate", "parent") '
                        'VALUES(16, \'Darova\', 5)')
        self.db.execute('INSERT INTO "TreeCompositeViewTable" '
                        '("@TreeCompositeViewTable", "translate") VALUES(17, \'Тест\')')
        self.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"TreeCompositeViewTable"\', '
                        '\'@TreeCompositeViewTable\'), 18, false)')

    @classmethod
    def setup_class(cls):
        """Перед всеми тестами"""

        cls.browser.open(cls.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in cls.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        log("Заполняем таблицу данными")
        self.update_table_view()

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_treecompositeview_table.html')
        self.browser.maximize_window()

    @data(False, True)
    def test_01_render(self, value):
        """01. Тест проверки отображения tree composite view table"""

        ctv = None
        if value is False:
            ctv = TreeCompositeViewStatic(self)
        if value is True:
            ctv = TreeCompositeView(self)
            log('Переключаем на данные из БД')
            ctv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ctv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        assert_that(lambda: ctv.table.rows_number, equal_to(5), 'В таблице неверное колличество записей', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(ctv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_02_delete_folder(self, value):
        """02. Тест проверки удаления папки в tree composite view table"""

        ctv = None
        if value is False:
            ctv = TreeCompositeViewStatic(self)
        if value is True:
            ctv = TreeCompositeView(self)
            log('Переключаем на данные из БД')
            ctv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ctv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем папку')
        ctv.table.row(contains_text='Привет').mouse_over()
        assert_that(ctv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        ctv.delete_item_btn.click()
        assert_that(ctv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        ctv.yes_btn.click()
        assert_that(ctv.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: ctv.table.rows_number, equal_to(4), 'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(ctv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Привет']
        for node in wrong_root:
            assert_that(lambda: ctv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папки(запись) - %s есть в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_03_delete_node(self, value):
        """03. Тест проверки удаления записи в tree composite view table"""

        ctv = None
        if value is False:
            ctv = TreeCompositeViewStatic(self)
        if value is True:
            ctv = TreeCompositeView(self)
            log('Переключаем на данные из БД')
            ctv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ctv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        ctv.table.row(contains_text='Тест').mouse_over()
        assert_that(ctv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        ctv.delete_item_btn.click()
        assert_that(ctv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        ctv.yes_btn.click()
        assert_that(ctv.no_btn, is_not_displayed(), 
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: ctv.table.rows_number, equal_to(4), 'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Привет', 'Пока', 'Как дела', 'Игра']
        for node in root:
            assert_that(ctv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Тест']
        for node in wrong_root:
            assert_that(lambda: ctv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папки(запись) - %s есть в TreeCompositeView' % node, and_wait())
            
    @data(False, True)
    def test_04_delete_node_in_folder(self, value):
        """04. Тест проверки удаления записи в папке tree composite view table"""

        ctv = None
        if value is False:
            ctv = TreeCompositeViewStatic(self)
        if value is True:
            ctv = TreeCompositeView(self)
            log('Переключаем на данные из БД')
            ctv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ctv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        ctv.table.row(contains_text='Привет').click()

        log('Удаляем запись')
        ctv.table.row(contains_text='Helga').mouse_over()
        assert_that(ctv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        ctv.delete_item_btn.click()
        assert_that(ctv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        ctv.yes_btn.click()
        assert_that(ctv.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: ctv.table.rows_number, equal_to(3), 'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Hello', 'Hola', 'Bonjour']
        for node in root:
            assert_that(ctv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Helga']
        for node in wrong_root:
            assert_that(lambda: ctv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папки(запись) - %s есть в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_05_delete_folder_in_folder(self, value):
        """05. Тест проверки удаления папки в папке tree composite view table"""

        ctv = None
        if value is False:
            ctv = TreeCompositeViewStatic(self)
        if value is True:
            ctv = TreeCompositeView(self)
            log('Переключаем на данные из БД')
            ctv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(ctv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Разворачиваем папку')
        ctv.table.row(contains_text='Привет').click()

        log('Удаляем папку')
        ctv.table.row(contains_text='Hello').mouse_over()
        assert_that(ctv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        ctv.delete_item_btn.click()
        assert_that(ctv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        ctv.yes_btn.click()
        assert_that(ctv.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: ctv.table.rows_number, equal_to(3), 'Кол-во записей не соответствует желаемому', and_wait())
        root = ['Helga', 'Hola', 'Bonjour']
        for node in root:
            assert_that(ctv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Hello']
        for node in wrong_root:
            assert_that(lambda: ctv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папки(запись) - %s есть в TreeCompositeView' % node, and_wait())
            
    @data(False, True)
    def test_06_expand(self, value):
        """06. Тест проверки раскрытия папки tree data grid"""

        tcv = None
        if value is False:
            tcv = TreeCompositeViewStatic(self)
        if value is True:
            tcv = TreeCompositeView(self)
            log('Переключаемся на получение данных из БД')
            tcv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tcv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Расскрываем папку нажатием по треугольнику')
        tcv.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()

        log('Проверяем, что папка раскрылась')
        assert_that(lambda: tcv.table.rows_number, equal_to(10), 'Папка не раскрылась', and_wait())

        root = ['Привет', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        log('Расскрываем вложенную в папку')
        tcv.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()

        log('Проверяем, что папка раскрылась')
        assert_that(lambda: tcv.table.rows_number, equal_to(12), 'Папка не раскрылась', and_wait())

        root = ['Привет', 'Hello', 'Darova', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_07_collapse(self, value):
        """07. Тест проверки свертывания папки tree data grid"""

        tcv = None
        if value is False:
            tcv = TreeCompositeViewStatic(self)
        if value is True:
            tcv = TreeCompositeView(self)
            log('Переключаемся на получение данных из БД')
            tcv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tcv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Расскрываем нужные папки нажатием по треугольнику')
        tcv.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        tcv.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()
        assert_that(lambda: tcv.table.rows_number, equal_to(12), 'Одна из папок не расскрылась', and_wait())

        log('Закрываем папку и проверяем, что она закрылась')
        tcv.table.row(contains_text='Hello').element('.controls-TreeView__expand').click()
        assert_that(lambda: tcv.table.rows_number, equal_to(10), 'Папка Hello не закрылась', and_wait())

        root = ['Привет', 'Hello', 'Helga', 'Hola', 'Bonjour', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Darova']
        for node in wrong_root:
            assert_that(lambda: tcv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeCompositeView' % node, and_wait())

        log('Закрываем еще одну папку и проверяем, что она закрылась')
        tcv.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        assert_that(lambda: tcv.table.rows_number, equal_to(5), 'Папка Привет не закрылась', and_wait())

        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Darova', 'Hello', 'Helga', 'Hola', 'Bonjour']
        for node in wrong_root:
            assert_that(lambda: tcv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeCompositeView' % node, and_wait())
            
    @data(False, True)
    def test_08_delete_folder_in_expand(self, value):
        """08. Тест проверки удаления папки при раскрытии другой папки в tree data grid"""

        tcv = None
        if value is False:
            tcv = TreeCompositeViewStatic(self)
        if value is True:
            tcv = TreeCompositeView(self)
            log('Переключаемся на получение данных из БД')
            tcv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tcv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Раскрываем папку')
        tcv.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()

        log('Удаляем папку')
        tcv.table.row(contains_text='Hello').mouse_over()
        assert_that(tcv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tcv.delete_item_btn.click()
        assert_that(tcv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tcv.yes_btn.click()
        assert_that(tcv.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что папка удалилась')
        assert_that(lambda: tcv.table.rows_number, equal_to(6),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Hello']
        for node in wrong_root:
            assert_that(lambda: tcv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeCompositeView' % node, and_wait())

    @data(False, True)
    def test_09_delete_node_in_expand(self, value):
        """09. Тест проверки удаления узла при раскрытии другой папки в tree data grid"""

        tcv = None
        if value is False:
            tcv = TreeCompositeViewStatic(self)
        if value is True:
            tcv = TreeCompositeView(self)
            log('Переключаемся на получение данных из БД')
            tcv.switcher.click()

        log('Проверяем, что страница готова к работе')
        assert_that(tcv.table, is_displayed(), 'Страница не загрузилась', and_wait())

        log('Удаляем запись')
        tcv.table.row(contains_text='Привет').element('.controls-TreeView__expand').click()
        tcv.table.row(contains_text='Hola').mouse_over()
        assert_that(tcv.delete_item_btn, is_displayed(), 'Панель операций над папкой(записью) не появилась', and_wait())
        tcv.delete_item_btn.click()
        assert_that(tcv.no_btn, is_displayed(), 'Диалог подтверждения удаления папки(записи) не появился', and_wait())
        tcv.yes_btn.click()
        assert_that(tcv.no_btn, is_not_displayed(),
                    'Диалог подтверждения удаления папки(запииси) не закрылся', and_wait())

        log('Проверяем, что запись удалилась')
        assert_that(lambda: tcv.table.rows_number, equal_to(6),
                    'Кол-во записей после удаления не равно ожидаемому', and_wait())
        root = ['Привет', 'Пока', 'Игра', 'Как дела', 'Тест']
        for node in root:
            assert_that(tcv.table.cell(contains_text=node), is_displayed(),
                        'Нет нужной папки(записи) %s в TreeCompositeView' % node, and_wait())

        wrong_root = ['Hola']
        for node in wrong_root:
            assert_that(lambda: tcv.table.cell(contains_text=node).is_displayed is False, is_(True),
                        'Не нужная папка(запись) %s есть в TreeCompositeView' % node, and_wait())

if __name__ == '__main__':
    run_tests()