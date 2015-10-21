# -*- coding: utf-8 -*-
from atf import *
import pages.new_data_set as new_data_set
import postgresql


@ddt
class TestOperationsPanel(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование OperationsPanel"""

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

        # ЗаметкаПанельОпераций
        self.db.execute('DELETE FROM "ЗаметкаПанельОпераций"')
        self.db.execute('INSERT INTO "ЗаметкаПанельОпераций" ("@ЗаметкаПанельОпераций", "Содержимое", "Завершена", '
                        '"withoutNDS") VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "ЗаметкаПанельОпераций" ("@ЗаметкаПанельОпераций","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "ЗаметкаПанельОпераций" ("@ЗаметкаПанельОпераций","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"ЗаметкаПанельОпераций"\', '
                                '\'@ЗаметкаПанельОпераций\' ), ' + str(i+1) + ', false )')
                break

    def update_table_view_100(self, num_records=100):
        """Обновление данных в таблицах"""
        log("Подготавливаем таблицу БД", "action")
        self.db = postgresql.open(self.PG_OPEN_ARG)

        # ЗаметкаПанельОпераций2
        self.db.execute('DELETE FROM "ЗаметкаПанельОпераций2"')
        self.db.execute('INSERT INTO "ЗаметкаПанельОпераций2" ("@ЗаметкаПанельОпераций2", "Содержимое", "Завершена", '
                        '"withoutNDS") VALUES( \'1\', \'Данные загружены через БД\', True, False )')
        i = 1
        while i < num_records:
            i += 1
            if i % 2 == 0:
                self.db.execute('INSERT INTO "ЗаметкаПанельОпераций2" ("@ЗаметкаПанельОпераций2","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', False, True )')
            else:
                self.db.execute('INSERT INTO "ЗаметкаПанельОпераций2" ("@ЗаметкаПанельОпераций2","Содержимое", '
                                '"Завершена", "withoutNDS") VALUES( ' + str(i) + ', \'' + str(i) +
                                ' заметка\', True, False )')
            if i == num_records:
                self.db.execute('SELECT pg_catalog.setval( pg_get_serial_sequence( \'"ЗаметкаПанельОпераций2"\', '
                                '\'@ЗаметкаПанельОпераций2\' ), ' + str(i+1) + ', false )')
                break

    @data(True, False)
    def test_01_render(self, value):
        """01. Отрисовка панели массовых операций"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Открываем панель по иконке, проверяем")
        assert_that(page_t.mass_open_lnk, is_displayed(), "Нет иконки открытия панели МО", and_wait(3))
        assert_that(page_t.mass_close_lnk, is_not_displayed(), "Открыта панель МО", and_wait(3))
        page_t.mass_open_lnk.click()
        assert_that(page_t.mass_close_lnk, is_displayed(), "Не открылась панель МО", and_wait(3))
        # assert_that(page_t.mass_open_lnk, is_not_displayed(), "Не пропала иконка открытия панели МО", and_wait(3))
        assert_that(page_t.mass_close_record_lnk, is_not_displayed(), "Видна ссылка завершения заметок", and_wait(3))
        assert_that(page_t.mass_delete_lnk, is_displayed(), "Не видна иконка удаления в панели МО", and_wait(3))
        assert_that(page_t.mass_select_all_lnk, is_not_displayed(), "Выпадающее меню в панели МО открыто", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отметить'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))

    @data(True, False)
    def test_02_select_all(self, value):
        """02. Возможность отметить все записи в датагриде"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Отмечаем все записи на странице (по чекбоксу в панели)")
        tmp_size = page_t.datagrid_tbl.rows_number
        page_t.mass_open_lnk.click()
        assert_that(page_t.mass_close_lnk, is_displayed(), "Не открылась панель МО", and_wait(3))
        page_t.mass_all_check_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено({0})'.format(tmp_size)),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(15),
                    'В DataGrid были отмечены не все строки', and_wait())

        log("Отменяем отмечание всех записей на странице (по чекбоксу в панели)")
        page_t.mass_all_check_lnk.click()
        assert_that(page_t.mass_close_lnk, is_not_displayed(), "Не закрылась панель МО", and_wait(3))
        page_t.mass_open_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отметить'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(0),
                    'В DataGrid есть отмечанные строки', and_wait())

    @data(True, False)
    def test_03_invert_selection(self, value):
        """03. Инвертирования выбранных записей"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Проверяем инверсию отметки всех записей")
        page_t.mass_open_lnk.click()
        page_t.mass_all_check_lnk.click()
        page_t.mass_select_lnk.click()
        page_t.mass_inver_lnk.click()
        assert_that(page_t.mass_close_lnk, is_not_displayed(), "Панель массовых операций все еще открыта", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(0),
                    'В DataGrid есть отмечанные строки', and_wait())

        log('Проверяем отмену инвертирования путем двойного инвертирования')
        tmp_size = page_t.datagrid_tbl.rows_number
        page_t.mass_open_lnk.click()
        page_t.mass_select_lnk.click()
        page_t.mass_inver_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено({0})'.format(tmp_size)),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(15),
                    'В DataGrid были отмеченны не все записи', and_wait())

    @data(True, False)
    def test_04_select_all_from_menu(self, value):
        """04. Выбор всех записей, через выпадающие меню в ПМО"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Проверяем выделение всех записей на странице через выпадающее меню")
        tmp_size = page_t.datagrid_tbl.rows_number
        page_t.mass_open_lnk.click()
        page_t.mass_select_lnk.click()
        page_t.mass_select_all_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено({0})'.format(tmp_size)),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(15),
                    'В DataGrid были отмеченны не все записи', and_wait())

        log("Проверяем отмену выделения всех записей на странице через выпадающее меню")
        page_t.mass_select_lnk.click()
        page_t.mass_unselect_all_lnk.click()
        assert_that(page_t.mass_close_lnk, is_not_displayed(), "Не закрылась панель МО", and_wait(3))
        page_t.mass_open_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отметить'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(0),
                    'В DataGrid есть отмеченные записи', and_wait())

    @data(True, False)
    def test_05_select_part(self, value):
        """05. Выбор части записей"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Выделяем одну запись")
        page_t.datagrid_tbl.row(contains_text='10 заметка').mouse_over()
        assert_that(lambda: page_t.datagrid_tbl.row(contains_text='10 заметка').
                    element('span.controls-ListView__itemCheckBox'), is_displayed(),
                    "Не появился чекбокс на строке", and_wait(3))
        page_t.datagrid_tbl.row(contains_text='10 заметка').element('span.controls-ListView__itemCheckBox').click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(1)'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(1),
                    'Было выбрано больше одной записи', and_wait())

        log("Выделяем еще запись")
        page_t.datagrid_tbl.row(contains_text='3 заметка').mouse_over()
        assert_that(lambda: page_t.datagrid_tbl.row(contains_text='3 заметка').
                    element('span.controls-ListView__itemCheckBox'), is_displayed(),
                    "Не появился чекбокс на строке", and_wait(3))
        page_t.datagrid_tbl.row(contains_text='3 заметка').element('span.controls-ListView__itemCheckBox').click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(2)'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(2),
                    'Было выбрано больше двух записей', and_wait())

        log("Инвертируем и проверяем")
        tmp_size = page_t.datagrid_tbl.rows_number
        page_t.mass_select_lnk.click()
        page_t.mass_inver_lnk.click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено({0})'.format(tmp_size-2)),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(tmp_size-2),
                    'Не были отмечены более двух записей', and_wait())

        log('Снимаем все выделения')
        page_t.mass_select_lnk.click()
        page_t.mass_unselect_all_lnk.click()
        assert_that(lambda: page_t.selected_rows_clst.count_elements, equal_to(0),
                    'В DataGrid есть отмеченные записи', and_wait())

    @data(True, False)
    def test_06_print_all_in_one_page(self, value):
        """06. Печать всех записей, если все данные поместились на страницу"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Печать всех записей")
        page_t.mass_open_lnk.click()
        page_t.mass_print_lnk.click()
        assert_that(page_t.print_window.print_table, is_displayed(),
                    "Не открылся диалог предварительного просмотра печати", and_wait())
        self.browser.switch_to_frame(page_t.print_window.print_frame.webelement())
        assert_that(lambda: len(self.driver.find_elements_by_tag_name('tr')), equal_to(16),
                    "Число записей в предварительном просмотре не то, что ожидалось", and_wait(3))
        self.browser.switch_to_parent_frame()
        page_t.print_window.close_btn.click()
        assert_that(page_t.print_window.print_table, is_not_displayed(),
                    "Не закрылась окно предварительной печати", and_wait(3))

    @data(True, False)
    def test_07_print_part_in_one_page(self, value):
        """07. Печать части записей, если все данные поместились на страницу"""

        self.update_table_view(15)
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(15),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
            log("Данные загружены через БД")
            first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Отмечаем несколько записей и печатаем")
        page_t.datagrid_tbl.row(contains_text='2 заметка').mouse_over()
        assert_that(lambda: page_t.datagrid_tbl.row(contains_text='2 заметка').
                    element('span.controls-ListView__itemCheckBox'), is_displayed(),
                    "Не появился чекбокс на строке", and_wait(3))
        page_t.datagrid_tbl.row(contains_text='2 заметка').element('span.controls-ListView__itemCheckBox').click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(1)'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))

        log('Отмечаем еще запись')
        page_t.datagrid_tbl.row(contains_text='7 заметка').mouse_over()
        assert_that(lambda: page_t.datagrid_tbl.row(contains_text='7 заметка').
                    element('span.controls-ListView__itemCheckBox'), is_displayed(),
                    "Не появился чекбокс на строке", and_wait(3))
        page_t.datagrid_tbl.row(contains_text='7 заметка').element('span.controls-ListView__itemCheckBox').click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(2)'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))

        log('Печатаем выбранные записи')
        page_t.mass_print_lnk.click()
        self.browser.switch_to_frame(page_t.print_window.print_frame.webelement())
        assert_that(lambda: len(self.driver.find_elements_by_tag_name('tr')), equal_to(3),
                    "Число записей в предварительном просмотре не то, что ожидалось", and_wait(3))
        self.browser.switch_to_parent_frame()
        page_t.print_window.close_btn.click()
        assert_that(page_t.print_window.print_table, is_not_displayed(),
                    "Не закрылась окно предварительной печати", and_wait(3))

    def test_08_print_all_with_many_pages(self):
        """08. Печать всех записей, если данные не поместились на страницу"""

        self.update_table_view_100()
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel_2.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(100),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        """
        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
        """
        log("Данные загружены через БД")
        first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Печать всех записей")
        page_t.mass_open_lnk.click()
        page_t.mass_print_lnk.click()
        page_t.select_print_window.all_page_link.click()
        page_t.select_print_window.ok_print_btn.click()
        page_t.yesnopage_dialog.yes_btn.click()
        assert_that(page_t.print_window.print_table, is_displayed(),
                    "Не открылся диалог предварительного просмотра печати", and_wait())
        self.browser.switch_to_frame(page_t.print_window.print_frame.webelement())
        assert_that(lambda: len(self.driver.find_elements_by_tag_name('tr')), equal_to(101),
                    "Число записей в предварительном просмотре не то, что ожидалось", and_wait(3))
        self.browser.switch_to_parent_frame()
        page_t.print_window.close_btn.click()
        assert_that(page_t.print_window.print_table, is_not_displayed(),
                    "Не закрылась окно предварительной печати", and_wait(3))

    def test_09_print_current_page_with_many_pages(self):
        """09. Печать текущей страницу, если все данные не поместились на страницу"""

        self.update_table_view_100()
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel_2.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(100),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        """
        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
        """
        log("Данные загружены через БД")
        first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Печать текущей страницы")
        page_t.mass_open_lnk.click()
        page_t.mass_print_lnk.click()
        page_t.select_print_window.current_page_link.click()
        page_t.select_print_window.ok_print_btn.click()
        assert_that(page_t.print_window.print_table, is_displayed(),
                    "Не открылся диалог предварительного просмотра печати", and_wait())
        self.browser.switch_to_frame(page_t.print_window.print_frame.webelement())
        assert_that(lambda: len(self.driver.find_elements_by_tag_name('tr')) % 30, equal_to(11),
                    "Число записей в предварительном просмотре не то, что ожидалось: {0}".
                    format(len(self.driver.find_elements_by_tag_name('tr'))), and_wait())
        self.browser.switch_to_parent_frame()
        page_t.print_window.close_btn.click()
        assert_that(page_t.print_window.print_table, is_not_displayed(),
                    "Не закрылась окно предварительной печати", and_wait(3))

    def test_10_part_selected_with_many_pages(self):
        """10. Печать части записей"""

        self.update_table_view_100()
        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel_2.html')
        self.browser.maximize_window()
        page_t = new_data_set.NewDataSet(self)
        assert_that(page_t.datagrid_tbl, is_displayed(), 'Не дождались открытия страницы теста', and_wait())

        assert_that(lambda: page_t.datagrid_tbl.rows_number, equal_to(100),
                    "Число записей в DataGrid не то, что ожидалось: {0}".format(page_t.datagrid_tbl.rows_number),
                    and_wait())

        """
        if not value:
            log("Переключаемся на загрузку данных из StaticSource")
            page_t.switch_btn.click()
            first_cell_text = 'Данные загружены через StaticSource'
        else:
        """
        log("Данные загружены через БД")
        first_cell_text = 'Данные загружены через БД'
        assert_that(first_cell_text, is_in(page_t.datagrid_tbl), "Не те данные в таблице, что ожидалось", and_wait())

        log("Печать части записей")
        page_t.mass_open_lnk.click()
        page_t.mass_print_lnk.click()
        page_t.select_print_window.pick_record_link.click()
        page_t.select_print_window.num_record_inp.type_in('10')
        page_t.select_print_window.ok_print_btn.click()
        assert_that(page_t.print_window.print_table, is_displayed(),
                    "Не открылся диалог предварительного просмотра печати", and_wait())
        self.browser.switch_to_frame(page_t.print_window.print_frame.webelement())
        assert_that(lambda: len(self.driver.find_elements_by_tag_name('tr')), equal_to(11),
                    "Число записей в предварительном просмотре не то, что ожидалось", and_wait(3))
        self.browser.switch_to_parent_frame()
        page_t.print_window.close_btn.click()
        assert_that(page_t.mass_close_lnk, is_not_displayed(), "Не закрылась панель МО", and_wait(3))

    @data(True, False)
    def test_11_delete_row(self, value):
        """11. Удаление записей"""

        self.update_table_view(15)

        self.browser.open(self.config.SITE + '/integration_datagrid_operations_panel.html')
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

        log("Удаляем одну запись через панель МО")
        if not value:
            tmp_txt = 'Данные загружены через StaticSource'
        else:
            tmp_txt = 'Данные загружены через БД'
        page_t.datagrid_tbl.row(contains_text=tmp_txt).mouse_over()
        assert_that(lambda: page_t.datagrid_tbl.row(contains_text=tmp_txt).
                    element('span.controls-ListView__itemCheckBox'), is_displayed(),
                    "Не появился чекбокс на строке", and_wait(3))
        page_t.datagrid_tbl.row(contains_text=tmp_txt).element('span.controls-ListView__itemCheckBox').click()
        assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(1)'),
                    "Текст ссылки не тот, что ожидался", and_wait(3))
        assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
        assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.get_attribute('class')),
                    "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        page_t.mass_delete_lnk.click()
        assert_that('Удалить текущую запись?', is_in(lambda: page_t.yesnopage_dialog.text_txt.text),
                    "Текст в диалоге удаления не тот, что ожидался", and_wait(5))
        page_t.yesnopage_dialog.yes_btn.click()
        assert_that(tmp_txt, is_not_in(lambda: page_t.datagrid_tbl.text),
                    "Не удалилась запись с текстом " + tmp_txt, and_wait())

        log("Удаляем пару записей через панель МО")
        tmp_arr = ['7 заметка', '15 заметка']
        for tmp_txt in tmp_arr:
            page_t.datagrid_tbl.row(contains_text=tmp_txt).mouse_over()
            assert_that(lambda: page_t.datagrid_tbl.row(contains_text=tmp_txt).
                        element('span.controls-ListView__itemCheckBox'), is_displayed(),
                        "Не появился чекбокс на строке", and_wait(3))
            page_t.datagrid_tbl.row(contains_text=tmp_txt).element('span.controls-ListView__itemCheckBox').click()
            if tmp_txt == '7 заметка':
                assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(1)'),
                            "Текст ссылки не тот, что ожидался", and_wait(3))
            elif tmp_txt == '15 заметка':
                assert_that(lambda: page_t.mass_select_lnk.text, equal_to('Отмечено(2)'),
                            "Текст ссылки не тот, что ожидался", and_wait(3))
            assert_that(lambda: 'controls-ToggleButton__null', is_in(page_t.mass_all_check_lnk.get_attribute('class')),
                        "Нет признака отметки части записей в чекбоксе панели МО", and_wait(3))
            assert_that(lambda: 'controls-Checked__checked', is_not_in(page_t.mass_all_check_lnk.
                                                                       get_attribute('class')),
                        "Есть признак отметки всех записей в чекбоксе панели МО", and_wait(3))
        page_t.mass_delete_lnk.click()
        assert_that('Удалить записи?', is_in(lambda: page_t.yesnopage_dialog.text_txt.text),
                    "Текст в диалоге удаления не тот, что ожидался", and_wait(5))
        page_t.yesnopage_dialog.yes_btn.click()
        for tmp_txt in tmp_arr:
            assert_that(tmp_txt, is_not_in(lambda: page_t.datagrid_tbl.text),
                        "Не удалилась запись с текстом " + tmp_txt, and_wait())

if __name__ == '__main__':
    run_tests()