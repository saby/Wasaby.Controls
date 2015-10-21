# -*- coding: utf-8 -*-
from atf import *
from pages.index import HighCharts
import postgresql


class TestHighCharts(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Тестирование диаграмм HighCharts"""

    conf = Config()
    BASE_VERSION = conf.BASE_VERSION
    PG_OPEN_ARG = 'pq://postgres:postgres@' + conf.SERVER + '/' + conf.BASE_VERSION
    db = None

    @classmethod
    def update_table_view(cls):
        """Заносим данные в таблицы"""

        # График
        cls.db.execute('DELETE FROM "График";')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES( 1, 50, 2001)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES( 2, 46, 2002)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES( 3, 43, 2003)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(4, 39, 2004)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(5, 32, 2005)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(6, 34, 2006)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(7, 35, 2007)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(8, 43, 2008)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(9, 57, 2009)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(10, 69, 2010)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(11, 85, 2011)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(12, 91, 2012)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(13, 81, 2013)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(14, 72, 2014)')
        cls.db.execute('INSERT INTO "График" ("@График", "Доход", "Года") VALUES(15, 63, 2015)')
        cls.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"График"\', \'@График\'), 16, false)')

        # График2
        cls.db.execute('DELETE FROM "График2";')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(1, 50, \'2001\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(2, 46, \'2002\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(3, 43, \'2003\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(4, 39, \'2004\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(5, 32, \'2005\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(6, 34, \'2006\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(7, 35, \'2007\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(8, 43, \'2008\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(9, 57, \'2009\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(10, 69, \'2010\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(11, 85, \'2011\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(12, 91, \'2012\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(13, 81, \'2013\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(14, 72, \'2014\')')
        cls.db.execute('INSERT INTO "График2" ("@График2", "Доход", "Года") VALUES(15, 63, \'2015\')')
        cls.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"График2"\', \'@График2\'), 16, false)')

        # График3
        cls.db.execute('DELETE FROM "График3";')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(1, 2001, 50, 46)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(2, 2002, 46, 44)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(3, 2003, 43, 39)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(4, 2004, 39, 37)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(5, 2005, 32, 38)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(6, 2006, 34, 32)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(7, 2007, 35, 31)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(8, 2008, 43, 41)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(9, 2009, 57, 53)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(10, 2010, 69, 67)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(11, 2011, 85, 81)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(12, 2012, 91, 89)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(13, 2013, 81, 77)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(14, 2014, 72, 70)')
        cls.db.execute('INSERT INTO "График3" ("@График3", "Года", "Ряд1", "Ряд2") VALUES(15, 2015, 63, 59)')
        cls.db.execute('SELECT pg_catalog.setval(pg_get_serial_sequence(\'"График3"\', \'@График3\'), 16, false)')

    @classmethod
    def setup_class(cls):
        """Данный метод вызывается перед началом всех тестов"""

        cls.browser.open(cls.config.SITE + '/service/sbis-rpc-service300.dll?stat')
        assert_that(lambda: '404' in cls.driver.title, is_(False), "Бизнес-логика не отвечает!", and_wait())

        log("Подготавливаем таблицу БД", "action")
        cls.db = postgresql.open(cls.PG_OPEN_ARG)

        log("Заполняем таблицу БД")
        cls.update_table_view()

    def test_01_diagram_line_render(self):
        """01. Тест проверки отображения линейной диаграммы"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_line.html')
        self.browser.maximize_window()

        hc = HighCharts(self)
        assert_that(hc.line, is_displayed(), 'Страница /integration_highcharts_line.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.line.element('#highcharts-0 > svg > g.highcharts-series-group > g.highcharts-markers.highcharts-tracker '
                        '> path:nth-child(4)').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'), 
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'), 
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_02_diagram_spline_render(self):
        """02. Тест проверки отображения сглаженной диаграммы с помощью сплайнов"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_spline.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.spline, is_displayed(), 'Страница /integration_highcharts_spline.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.spline.element('#highcharts-0 > svg > g.highcharts-series-group > g.highcharts-markers.highcharts-tracker '
                          '> path:nth-child(4)').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_03_diagram_bar_render(self):
        """03. Тест проверки отображения гистограммы"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_bar.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.bar, is_displayed(), 'Страница /integration_highcharts_bar.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.texts.item(contains_text='91').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_04_diagram_column_render(self):
        """04. Тест проверки отображения столбчатой диаграммы """

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_column.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.column, is_displayed(), 'Страница /integration_highcharts_column.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.texts.item(contains_text='91').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_05_diagram_pie_render(self):
        """05. Тест проверки отображения круговой диаграммы"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_pie.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.pie, is_displayed(), 'Страница /integration_highcharts_pie.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='2012'), is_displayed(),
                    'На графике нет точки со значение 2012', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.pie.element('#highcharts-0 > svg > g.highcharts-data-labels.highcharts-tracker > g:nth-child(27) '
                       '> text').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_06_diagram_area_line_render(self):
        """06. Тест проверки отображения диаграммы c выделением"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_area.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.area, is_displayed(), 'Страница /integration_highcharts_area.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.area.element('#highcharts-0 > svg > g.highcharts-series-group > g.highcharts-markers.highcharts-tracker '
                        '> path:nth-child(4)').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_07_diagram_area_spline_render(self):
        """07. Тест проверки отображения сглаженной диаграммы с помощью сплайнов и c выделением"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_area_spline.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.area_spline, is_displayed(),
                    'Страница /integration_highcharts_area_spline.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.area_spline.element('#highcharts-0 > svg > g.highcharts-series-group > '
                               'g.highcharts-markers.highcharts-tracker > path:nth-child(4)').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.tooltip_x.text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть 2012', and_wait())
        assert_that(lambda: hc.tooltip_y.text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть 91', and_wait())

    def test_08_diagram_scatter_render(self):
        """08. Тест проверки отображения точечной диаграммы"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_scatter.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.scatter, is_displayed(),
                    'Страница /integration_highcharts_scatter.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        assert_that(hc.texts.item(contains_text='91'), is_displayed(),
                    'На графике нет точки со значение 91', and_wait())

        log('Проверяем отображение всплывающей подсказки')
        hc.texts.item(contains_text='91').mouse_over()
        assert_that(hc.tooltip, is_displayed(), 'Всплывающая подсказка не появилась', and_wait())

        log('Проверяем значения всплывающей подсказки')
        assert_that(lambda: hc.scatter_tooltip.item(1).text, equal_to('2012'),
                    'Текст в всплывающей подсказске должен быть ', and_wait())
        assert_that(lambda: hc.scatter_tooltip.item(2).text, equal_to('91'),
                    'Текст в всплывающей подсказске должен быть ', and_wait())

    def test_09_diagram_area_range_render(self):
        """09. Тест проверки отображения диаграммы диапазона"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_area_range.html')
        self.browser.maximize_window()
        hc = HighCharts(self)
        assert_that(hc.area_range, is_displayed(),
                    'Страница /integration_highcharts_area_range.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        log('Проверяем отображение всплывающей подсказки')
        log('Проверяем значения всплывающей подсказки')

    def test_10_diagram_area_range_render(self):
        """10. Тест проверки отображения диаграммы диапазона со сглаживанием сплайнами"""

        log('Переходим на нужную страницу')
        self.browser.open(self.config.SITE + '/integration_highcharts_area_spline_range.html')
        hc = HighCharts(self)
        assert_that(hc.area_spline_range, is_displayed(),
                    'Страница /integration_highcharts_area_spline_range.html не открылась', and_wait())

        log('Проверям, что на графике есть нужная точка')
        log('Проверяем отображение всплывающей подсказки')
        log('Проверяем значения всплывающей подсказки')

if __name__ == '__main__':
    run_tests()