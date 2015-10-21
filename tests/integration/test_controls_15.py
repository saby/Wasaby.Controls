# -*- coding: utf-8 -*-
from atf import *
import pages.new_data_set as new_data_set
import postgresql


@ddt
class TestFilter(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование Filter"""

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

        # ЗаметкаФильтр
        self.db.execute('DELETE FROM "ЗаметкаФильтр"')
        self.db.execute('INSERT INTO "ЗаметкаФильтр" ("@ЗаметкаФильтр","Содержимое", "Завершена", "withoutNDS") '
                        'VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "ЗаметкаФильтр" ("@ЗаметкаФильтр","Содержимое", "Завершена", "withoutNDS")'
                                ' VALUES( ' + str(i) + ', \'' + str(i) + ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "ЗаметкаФильтр" ("@ЗаметкаФильтр","Содержимое", "Завершена", "withoutNDS")'
                                ' VALUES( ' + str(i) + ', \'' + str(i) + ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"ЗаметкаФильтр"\', '
                                '\'@ЗаметкаФильтр\' ), ' + str(i+1) + ', false )')
                break

    @data(True, False)
    def test_01_render(self, value):
        """01. Отображение и открытие фильтра"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_filter.html')
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

        assert_that(first_cell_text, is_in(page_t.datagrid_tbl),
                    "Проблемы с отображением содержимого (не оттуда подгрузились данные?)", and_wait())

        log('Проверяем, что кнопка фильтра есть на странице')
        assert_that(page_t.filter_open_btn, is_displayed(), 'Кнопка фильтри нет на странице', and_wait())
        assert_that(page_t.filter_text_lnk, is_displayed(), 'Ссылки фильтри нет на странице', and_wait())

        log('Открываем фильтр по кнопке и проверяем, что в нем есть нужные элементы')
        page_t.filter_open_btn.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(3))
        assert_that(page_t.filter_clear_lnk, is_displayed(), 'Нет ссылки сброса фильтра', and_wait(3))
        page_t.filter_close_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait())

        log('Открываем фильтр по ссылке и проверяем, что в нем есть нужные элементы')
        page_t.filter_text_lnk.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(3))
        assert_that(page_t.filter_clear_lnk, is_displayed(), 'Нет ссылки сброса фильтра', and_wait(3))
        page_t.filter_close_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait(5))

    @data(True, False)
    def test_02_filtering(self, value):
        """02. Проверка работы фильтрации"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_filter.html')
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

        assert_that(first_cell_text, is_in(page_t.datagrid_tbl),
                    "Проблемы с отображением содержимого (не оттуда подгрузились данные?)", and_wait())

        log("Открываем фильтр по ссылки и отбираем записи 'С НДС' (false), проверяем")
        page_t.filter_text_lnk.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(5))
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_2_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait())
        assert_that(lambda: page_t.filter_text_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия фильтра", and_wait(3))
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(8),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        log("Открываем фильтр по кнопке и отбираем записи 'Без НДС' (true), проверяем")
        page_t.filter_open_btn.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(3))
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_1_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('Без НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(7),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        log("Открываем фильтр по кнопке и отбираем записи 'С НДС' (false), проверяем")
        page_t.filter_open_btn.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(3))
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_2_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(8),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        log("Открываем фильтр по ссылке и отбираем записи 'Без НДС' (true), проверяем")
        page_t.filter_open_btn.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(3))
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_1_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('Без НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), "Не закрылась область фильтра", and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(7),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

    @data(True, False)
    def test_03_reset(self, value):
        """03. Проверка работы сброса фильтрации"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_filter.html')
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

        assert_that(first_cell_text, is_in(page_t.datagrid_tbl),
                    "Проблемы с отображением содержимого (не оттуда подгрузились данные?)", and_wait())

        log("Открываем фильтр по ссылки и выбираем записи 'С НДС' (false)")
        page_t.filter_text_lnk.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), "Не открылась область фильтра", and_wait(5))
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_2_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))

        log('Сбрасываем фильтр')
        page_t.filter_clear_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('Без НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка после сброса", and_wait(3))

        log('Отбираем с НДС')
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_2_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), 'Не закрылась область фильтра', and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(8),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        log('Сбрасываем фильтрацию по крестику в хлебных крошках')
        page_t.filter_fast_clear_lnk.click()
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Не сбросился фильтр из хлебных крошек", and_wait())

        log('Отбираем c НДС')
        page_t.filter_open_btn.click()
        page_t.filter_dropdown_open_lnk.click()
        page_t.filter_dropdown_2_lnk.click()
        assert_that(lambda: page_t.filter_dropdown_open_lnk.text, equal_to('С НДС'),
                    "Не изменился текст ссылки открытия выпадающего списка", and_wait(3))
        page_t.filter_apply_btn.click()
        assert_that(page_t.filter_apply_btn, is_not_displayed(), 'Не закрылась область фильтра', and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(8),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

        log('Сбрасываем фильтрацию')
        page_t.filter_open_btn.click()
        assert_that(page_t.filter_apply_btn, is_displayed(), 'Область фильтра не закрылась', and_wait())
        page_t.filter_clear_lnk.click()
        page_t.filter_close_btn.click()
        assert_that(page_t.filter_close_btn, is_not_displayed(), 'Область фильтра не закрылась', and_wait())
        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось", and_wait())

if __name__ == '__main__':
    run_tests()