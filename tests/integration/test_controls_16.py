# -*- coding: utf-8 -*-
from atf import *
import pages.new_data_set as new_data_set
from selenium.webdriver.common.keys import Keys
import postgresql


@ddt
class TestEditAtPlace(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование EditAtPlace"""

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

        # ЗаметкаРедактированиеПоМесту
        self.db.execute('DELETE FROM "ЗаметкаРедактированиеПоМесту"')
        self.db.execute('INSERT INTO "ЗаметкаРедактированиеПоМесту" ("@ЗаметкаРедактированиеПоМесту","Содержимое", '
                        '"Завершена", "withoutNDS") VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "ЗаметкаРедактированиеПоМесту" ("@ЗаметкаРедактированиеПоМесту",'
                                '"Содержимое", "Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "ЗаметкаРедактированиеПоМесту" ("@ЗаметкаРедактированиеПоМесту",'
                                '"Содержимое", "Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"ЗаметкаРедактированиеПоМесту"\', '
                                '\'@ЗаметкаРедактированиеПоМесту\' ), ' + str(i+1) + ', false )')
                break

    @data(True, False)
    def test_01_start(self, value):
        """01. Открытие редактирования по месту"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        log("Проверяем, что клик по строке при редактировании по месту не выделяет весь текст в ней")
        tmp_txt = '11 заметка'
        num_row = page_t.datagrid_tbl.cell(with_text=tmp_txt).position[0]
        page_t.datagrid_tbl.row(num_row).mouse_over()
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(Keys.DELETE+Keys.RETURN, clear_txt=False)
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('12 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(lambda: len(page_t.datagrid_tbl.cell(num_row, 3).text), not_equal(0),
                    "Удалился весь текст из строки после клика по ней", and_wait(2))

        log("Проверяем изменение записей после клика на строку")
        tmp_arr = ['5 заметка', '6 заметка']
        for tmp_txt in tmp_arr:
            num_row = page_t.datagrid_tbl.row(contains_text=tmp_txt).position
            page_t.datagrid_tbl.cell(num_row, 2).click()
            page_t.datagrid_tbl.row(num_row).mouse_over()
            page_t.atplace_field_inp.click()
            page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.RETURN)
            page_t.datagrid_tbl.row(num_row).mouse_over()
            page_t.atplace_checkbox_1.click()
            page_t.datagrid_tbl.cell(2, 2).click()
            assert_that(lambda: tmp_txt + ' доп.текст в заметке',
                        is_in(page_t.datagrid_tbl.cell(contains_text=tmp_txt).text),
                        "Текст строки после редактирования не тот, что ожидался", and_wait())

    @data(True, False)
    def test_03_move_on_down_arrow(self, value):
        """03. Перемещение редактирования по стрелке вниз"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        log("Проверяем переход на новую запись по кнопкам DOWN")
        tmp_txt = '13 заметка'
        num_row = page_t.datagrid_tbl.row(contains_text=tmp_txt).position
        page_t.datagrid_tbl.row(num_row).mouse_over()
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(tmp_txt),
                    "Текст в поле ввода быстрого редактирования не тот, что ожидался", and_wait(3))

        log('Смещаемся на строчку вниз')
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.DOWN)
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('14 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(tmp_txt + ' доп.текст в заметке ',
                    is_in(lambda: page_t.datagrid_tbl.row(contains_text=tmp_txt).text),
                    "Текст строки после редактирования не тот, что ожидался", and_wait(3))

        log('Смещаемся еще на одну строчку вниз')
        page_t.atplace_field_inp.type_in(Keys.DOWN, clear_txt=False)
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('15 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(lambda: page_t.datagrid_tbl.row(num_row+1).text, equal_to('14 заметка false true'),
                    "Текст строки после перехода вниз не тот, что ожидался", and_wait(3))

        log("Проверяем, что 'DOWN' на последней строке ничего не изменяет")
        page_t.atplace_field_inp.type_in(Keys.DOWN, clear_txt=False)
        assert_that(lambda: page_t.datagrid_tbl.row(num_row+2).text, equal_to('15 заметка true false'),
                    "Текст последней строки после перехода вниз не тот, что ожидался", and_wait(3))
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('15 заметка'),
                    "Поля ввода быстрого редактирования переместились на след. запись?", and_wait(3))

    @data(True, False)
    def test_04_exit_on_enter(self, value):
        """04. Завершение редактирования по ENTER"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        if self.conf.BROWSER == 'chrome' or self.conf.BROWSER == 'Chrome':
            log("Проверяем завершение редактирования по месту вводом ENTER в него")
            page_t.datagrid_tbl.cell(15, 2).click()
            page_t.atplace_field_inp.type_in(Keys.RETURN, clear_txt=False)
            assert_that(lambda: page_t.datagrid_tbl.row(15).text, equal_to('15 заметка true false'),
                        "Текст последней строки после перехода вниз не тот, что ожидался", and_wait(3))
            assert_that(lambda: page_t.atplace_field_inp, is_not_displayed(),
                        "не закрылось быстрое редактирование", and_wait(3))

        log("Проверяем переход на новую запись по ENTER")
        tmp_txt = '5 заметка'
        num_row = page_t.datagrid_tbl.cell(with_text=tmp_txt).position[0]
        page_t.datagrid_tbl.row(num_row).mouse_over()
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(tmp_txt),
                    "Текст в поле ввода быстрого редактирования не тот, что ожидался", and_wait(3))
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.RETURN)
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('6 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(tmp_txt + ' доп.текст в заметке ',
                    is_in(lambda: page_t.datagrid_tbl.row(num_row).text),
                    "Текст строки после редактирования не тот, что ожидался", and_wait(3))
        page_t.atplace_field_inp.type_in(Keys.RETURN, clear_txt=False)
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('7 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(lambda: page_t.datagrid_tbl.row(num_row+1).text, equal_to('6 заметка false true'),
                    "Текст строки после перехода вниз не тот, что ожидался", and_wait(3))

    @data(True, False)
    def test_05_move_on_up_arrow(self, value):
        """05. Перемещение редактирования по месту по кнопке стрелка вверх"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        log("Проверяем переход на новую запись по кнопкам up")
        tmp_txt = '3 заметка'
        num_row = page_t.datagrid_tbl.cell(with_text=tmp_txt).position[0]
        page_t.datagrid_tbl.row(num_row).mouse_over()
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(tmp_txt),
                    "Текст в поле ввода быстрого редактирования не тот, что ожидался", and_wait(3))

        log('Переходим на строку вверх')
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.UP)
        assert_that(tmp_txt + ' доп.текст в заметке ',
                    is_in(lambda: page_t.datagrid_tbl.row(num_row).text),
                    "Текст строки после редактирования не тот, что ожидался", and_wait(3))
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('2 заметка'),
                    "Поля ввода быстрого редактирования не переместились на пред. запись", and_wait(3))

        log('Переходим еще на строку вверх')
        page_t.atplace_field_inp.type_in(Keys.UP, clear_txt=False)
        assert_that(lambda: page_t.datagrid_tbl.row(num_row-1).text, equal_to('2 заметка false true'),
                    "Текст строки после перехода вверх не тот, что ожидался", and_wait(3))
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(first_cell_text),
                    "Поля ввода быстрого редактирования не переместились на пред. запись", and_wait(3))

        log("Проверяем, что 'UP' на первой строке ничего не изменяет")
        page_t.atplace_field_inp.type_in(Keys.UP, clear_txt=False)
        assert_that(lambda: page_t.datagrid_tbl.row(1).text, equal_to(first_cell_text + ' true false'),
                    "Текст первой строки после перехода вверх не тот, что ожидался", and_wait(3))
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(first_cell_text),
                    "Поля ввода быстрого редактирования переместились на пред. запись?", and_wait(3))

    @data(True, False)
    def test_06_move_on_tab(self, value):
        """06. Переход на следующую запись по TAB"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        log("Проверяем переход по TAB")
        page_t.datagrid_tbl.cell(8, 2).click()
        tmp_txt = '8 заметка'
        num_row = page_t.datagrid_tbl.cell(with_text=tmp_txt).position[0]
        tmp_action_txt = page_t.datagrid_tbl.cell(num_row, 3).text
        if tmp_action_txt == 'false':
            tmp_action_txt = 'true'
        elif tmp_action_txt == 'true':
            tmp_action_txt = 'false'
        else:
            tmp_action_txt = 'текст колонки "Завершена" не true или false'

        tmp_nds_txt = page_t.datagrid_tbl.cell(num_row, 4).text
        if tmp_nds_txt == 'false':
            tmp_nds_txt = 'true'
        elif tmp_nds_txt == 'true':
            tmp_nds_txt = 'false'
        else:
            tmp_nds_txt = 'текст колонки "Завершена" не true или false'

        page_t.datagrid_tbl.row(num_row).mouse_over()
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(tmp_txt),
                    "Текст в поле ввода быстрого редактирования не тот, что ожидался", and_wait(3))
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.TAB)
        page_t.atplace_checkbox_11.type_in(Keys.SPACE+Keys.TAB)
        page_t.atplace_checkbox_22.type_in(Keys.SPACE+Keys.TAB)

        assert_that(lambda: page_t.atplace_field_inp.text, equal_to('9 заметка'),
                    "Поля ввода быстрого редактирования не переместились на след. запись", and_wait(3))
        assert_that(lambda: page_t.datagrid_tbl.row(num_row).text,
                    equal_to(tmp_txt + ' доп.текст в заметке ' + tmp_action_txt + ' ' + tmp_nds_txt),
                    "Текст строки после редактирования не тот, что ожидался", and_wait(10))

    @data(True, False)
    def test_07_move_on_shift_tab(self, value):
        """07. Переход на следующую строку редактирования по SHIFT+TAB"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_edit_at_place.html')
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

        log("Проверяем переход по SHIFT+TAB")
        page_t.datagrid_tbl.cell(7, 2).click()
        tmp_txt = '7 заметка'
        num_row = page_t.datagrid_tbl.cell(with_text=tmp_txt).position[0]

        page_t.datagrid_tbl.row(num_row).mouse_over()
        assert_that(lambda: page_t.atplace_field_inp.text, equal_to(tmp_txt),
                    "Текст в поле ввода быстрого редактирования не тот, что ожидался", and_wait(3))
        page_t.atplace_field_inp.click()
        page_t.atplace_field_inp.type_in(Keys.TAB, clear_txt=False)
        page_t.atplace_checkbox_11.type_in(Keys.TAB)

        page_t.atplace_checkbox_22.type_in(Keys.SPACE+Keys.SHIFT+Keys.TAB)
        page_t.atplace_checkbox_11.type_in(Keys.SPACE+Keys.SHIFT+Keys.TAB)
        page_t.atplace_field_inp.type_in(tmp_txt+' доп.текст в заметке'+Keys.SHIFT+Keys.TAB)

        assert_that(lambda: page_t.atplace_field_inp.text, not_equal(tmp_txt),
                    "Поля ввода быстрого редактирования переместились на пред. запись", and_wait(3))

if __name__ == '__main__':
    run_tests()