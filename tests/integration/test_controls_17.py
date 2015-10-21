# -*- coding: utf-8 -*-
from atf import *
import pages.new_data_set as new_data_set
import postgresql


@ddt
class TestDataGridPartScroll(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование DataGrid PartScroll"""

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

        # ЗаметкаЧастичныйСкролл
        self.db.execute('DELETE FROM "ЗаметкаЧастичныйСкролл"')
        self.db.execute('INSERT INTO "ЗаметкаЧастичныйСкролл" ("@ЗаметкаЧастичныйСкролл","Содержимое", '
                        '"Завершена", "withoutNDS") VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "ЗаметкаЧастичныйСкролл" ("@ЗаметкаЧастичныйСкролл","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "ЗаметкаЧастичныйСкролл" ("@ЗаметкаЧастичныйСкролл","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"ЗаметкаЧастичныйСкролл"\', '
                                '\'@ЗаметкаЧастичныйСкролл\' ), ' + str(i+1) + ', false )')
                break

    @skip('Функционал теста еще не готов')
    def test_01_auto_scroll_up(self):
        """01. Автоподгрузка по скроллу вверх"""

        self.update_table_view(500)
        self.browser.open(self.config.SITE + '/integration_datagrid_part_scroll.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number % 30, equal_to(0),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        log("Устанавливаем offset=90 ")
        script_txt = "t = $('[name=\"DataGridBL\"]').wsControl(); t.reload(t._filter, t._sorting, 90, t._limit);"
        self.driver.execute_script(script_txt)
        assert_that('91 заметка true', is_in(lambda: page_t.datagrid_tbl.text),
                    "Не выставлен offset у DataGrid", and_wait())
        assert_that('119 заметка true', is_in(lambda: page_t.datagrid_tbl.text),
                    "Не выставлен offset у DataGrid", and_wait())
        assert_that('121 заметка true', is_not_in(lambda: page_t.datagrid_tbl.text),
                    "Не выставлен offset у DataGrid", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(30),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        for i in range(20):
            num_displayed_records = page_t.datagrid_tbl.rows_number
            if num_displayed_records >= 120:
                break
            log("Скроллируем страницу вверх и проверяем количество записей в контролах")
            self.driver.execute_script("window.scrollTo(0,0)")
            if num_displayed_records+30 >= 120:
                assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(120),
                            "В DataGrid не то количество записей после скролла, что ожидалось", and_wait())
            else:
                assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(num_displayed_records+30),
                            "В DataGrid не то количество записей после скролла, что ожидалось", and_wait())
            log('Номер скролла: {0} \tКоличество записей в таблице: {1}'.format(i, page_t.datagrid_tbl.rows_number))

if __name__ == '__main__':
    run_tests()