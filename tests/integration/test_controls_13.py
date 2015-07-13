# -*- coding: utf-8 -*-
from atf import *
import pages.new_data_set as new_data_set
import postgresql


@ddt
class TestDataGrid(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование DataGrid"""

    CMT_DATETIME = ''
    db = ''
    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    error = "ws-validation-error"

    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION

    def setup(self):
        """С вызова этой функции начинается каждый тест"""

        self.browser.open(self.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in self.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())
        log("Site={0} БД={1}".format(self.config.SITE, self.PG_OPEN_ARG))

    def update_table_view(self, num_records=2):
        """Обновление данных в таблицах"""

        log("Подготавливаем таблицу БД", "action")
        self.db = postgresql.open(self.PG_OPEN_ARG)

        # Заметка
        self.db.execute('DELETE FROM "Заметка"')
        self.db.execute('INSERT INTO "Заметка" ("@Заметка","Содержимое", "Завершена", "withoutNDS") '
                        'VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "Заметка" ("@Заметка","Содержимое", "Завершена", "withoutNDS") '
                                'VALUES( ' + str(i) + ', \'' + str(i) + ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "Заметка" ("@Заметка","Содержимое", "Завершена", "withoutNDS") '
                                'VALUES( ' + str(i) + ', \'' + str(i) + ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"Заметка"\', '
                                '\'@Заметка\' ), ' + str(i+1) + ', false )')
                break

    @staticmethod
    def check_data(page_t=None, num_records=2):
        """Проверка данных при стартовой загрузке страницы"""

        log("Проверяем, что данные из БД отображаются верно")
        if num_records > 10:
            assert_that(lambda: page_t.listview_clst.size, equal_to(20),
                        "Число записей в CustomListView не то, что ожидалось", and_wait())
            assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(20),
                        "Число записей в DataGrid не то, что ожидалось", and_wait())
        else:
            assert_that(lambda: page_t.listview_clst.size, equal_to(num_records),
                        "Число записей в CustomListView не то, что ожидалось", and_wait())
            assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(num_records),
                        "Число записей в DataGrid не то, что ожидалось", and_wait())

        for i in range(num_records):
            assert_that(lambda: page_t.listview_clst.item(i+1).text, equal_to('{0} заметка'.format(i+1)),
                        "Текст у элемента {0} не тот, что ожидался".format(i+1), and_wait())
            if i % 2 == 0:
                assert_that('taskComplete', is_in(lambda: page_t.listview_clst.item(i+1).
                                                  element('.taskTxt').get_attribute('class')),
                            "Не найден нужный класс у заметки", and_wait())
            else:
                assert_that('taskComplete', is_not_in(lambda: page_t.listview_clst.item(i+1).
                                                      element('.taskTxt').get_attribute('class')),
                            "Найден лишний класс у заметки", and_wait())
            if i > 4:
                break

        if num_records == 2:
            tbl_str = '@Заметка Содержимое Завершена\n1 1 заметка true\n2 2 заметка false'
            assert_that(lambda: page_t.datagrid_tbl.text, equal_to(tbl_str),
                        "В таблице не те данные, что ожидалось", and_wait())

    """
    @skip('Функционал теста еще не готов')
    def test_01_insert(self):
        "01. Добавление записей"

        self.update_table_view()

        self.browser.open(self.config.SITE + '/NewDataSet.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.field_inp, is_displayed(), 'Не дождались открытия страницы теста', and_wait(60))

        self.check_data(page_t)

        log("Добавляем заметку")
        page_t.field_inp.type_in('3 заметка' + Keys.RETURN)

        log("Проверяем, что она добавилась и данные из БД отображаются верно")
        assert_that(lambda: page_t.listview_clst.size, equal_to(3),
                    "Число записей в CustomListView не то, что ожидалось", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(3),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())
        tmp_cnt = page_t.listview_clst.size
        for i in range(tmp_cnt):
            assert_that(lambda: page_t.listview_clst.item(i+1).text, equal_to('{0} заметка'.format(i+1)),
                        "Текст у элемента {0} не тот, что ожидался".format(i+1), and_wait(3))
            if i == 0:
                assert_that('taskComplete', is_in(lambda: page_t.listview_clst.item(i+1).
                                                  element('.taskTxt').get_attribute('class')),
                            "Не найден нужный класс у заметки", and_wait(3))
            else:
                assert_that('taskComplete', is_not_in(lambda: page_t.listview_clst.item(i+1).
                                                      element('.taskTxt').get_attribute('class')),
                            "Найден лишний класс у заметки ({0} заметка)".format(i+1), and_wait(3))
        tbl_str = '@Заметка Содержимое Завершена\n1 1 заметка true\n2 2 заметка false\n3 3 заметка false'
        assert_that(lambda: page_t.datagrid_tbl.text, equal_to(tbl_str),
                    "В таблице не те данные, что ожидалось", and_wait(3))
    """

    @data(True, False)
    def test_02_delete(self, value):
        """02. Удаление записей"""

        self.update_table_view(15)

        self.browser.open(self.config.SITE + '/integration_datagrid.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Удаляем пару записей по иконке на строке")
        if not value:
            tmp_arr = ['Данные загружены через StaticSource', '7 заметка', '15 заметка']
        else:
            tmp_arr = ['Данные загружены через БД', '7 заметка', '15 заметка']
        for tmp_txt in tmp_arr:
            page_t.datagrid_tbl.row(contains_text=tmp_txt).mouse_over()
            page_t.delete_lnk.click()
            assert_that(page_t.yesnopage_dialog.yes_btn, is_displayed(), "Не открылся диалог удаления", and_wait(5))
            page_t.yesnopage_dialog.yes_btn.click()
            assert_that(tmp_txt, is_not_in(lambda: page_t.datagrid_tbl.text),
                        "Не удалилась запись с текстом " + tmp_txt, and_wait())

    """
    @skip('Функционал теста еще не готов')
    def test_03_edit(self):
        "03. Редактирование записи"

        self.update_table_view()

        self.browser.open(self.config.SITE + '/NewDataSet.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.field_inp, is_displayed(), 'Не дождались открытия страницы теста', and_wait(60))

        self.check_data(page_t)

        log("Редактируем заметку")
        page_t.listview_clst.item(2).element('.taskTxt').click()
        assert_that(lambda: page_t.listview_clst.item(2).element('input.text'), is_displayed(),
                    "Не отобразилось поле редактирования по месту", and_wait())
        page_t.listview_clst.item(2).element('input.text').type_in(Keys.END + Keys.SHIFT + Keys.HOME + Keys.DELETE)
        page_t.listview_clst.item(2).element('input.text').type_in('3 заметка' + Keys.RETURN)

        log("Проверяем, что она изменилась и данные из БД отображаются верно")
        assert_that(lambda: page_t.listview_clst.size, equal_to(2),
                    "Число записей в CustomListView не то, что ожидалось", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(2),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())
        tmp_cnt = page_t.listview_clst.size
        for i in range(tmp_cnt):
            if i == 0:
                assert_that('taskComplete', is_in(lambda: page_t.listview_clst.item(i+1).
                                                  element('.taskTxt').get_attribute('class')),
                            "Не найден нужный класс у заметки", and_wait(3))
                assert_that(lambda: page_t.listview_clst.item(i+1).text, equal_to('1 заметка'),
                            "Текст у элемента {0} не тот, что ожидался".format(i+1), and_wait(3))
            else:
                assert_that('taskComplete', is_not_in(lambda: page_t.listview_clst.item(i+1).
                                                      element('.taskTxt').get_attribute('class')),
                            "Найден лишний класс у заметки ({0} заметка)".format(i+1), and_wait(3))
                assert_that(lambda: page_t.listview_clst.item(i+1).text, equal_to('3 заметка'),
                            "Текст у элемента {0} не тот, что ожидался".format(i+1), and_wait(3))
        tbl_str = '@Заметка Содержимое Завершена\n1 1 заметка true\n2 3 заметка false'
        assert_that(lambda: page_t.datagrid_tbl.text, equal_to(tbl_str),
                    "В таблице не те данные, что ожидалось", and_wait(3))
    """

if __name__ == '__main__':
    run_tests()