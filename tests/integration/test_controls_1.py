# -*- coding: utf-8 -*-
from atf import *
from selenium.webdriver.common.keys import Keys
from pages.index import Button


class TestButton(TestCaseUI):
    """Интеграционное тестирование SBIS3.CONTROLS - Кнопки"""

    conf = Config()
    primary_button = 'controls-Button__primary'
    enabled = 'ws-enabled'
    disabled = 'ws-disabled'
    icon_button = 'controls-IconButton'
    icon32 = 'icon-32'
    icon16 = 'icon-16'

    def setup(self):
        """Данный метод вызывается перед началом каждого тестов"""

        self.browser.open(self.config.SITE + '/integration_button.html')
        self.browser.maximize_window()
        b = Button(self)
        assert_that(b.button_1, is_displayed(), 'Страница /integration_button.html не открылась', and_wait())

    def test_01_elements(self):
        """01. Тест проверки отображения элементов на странице"""

        log('Проверяем наличие элементов на панели')
        b = Button(self)
        assert_that(b.button_1, is_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.button_2, is_not_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.button_3, is_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.icon_button, is_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.link_1, is_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.link_2, is_not_displayed(), 'Кнопка не появилась на странице', and_wait())
        assert_that(b.icon_link, is_displayed(), 'Кнопка не появилась на странице', and_wait())

    def test_02_main_button(self):
        """02. Тест проверки обычной кнопки"""

        log('Проверяем, что первая кнопка Главная')
        b = Button(self)
        assert_that(lambda: b.button_1.text, equal_to('Главная кнопка'),
                    'Текст у кнопки должен быть Главная кнопка', and_wait())
        assert_that(lambda: self.primary_button in b.button_1.get_attribute('class'), is_(True),
                    'Первая кнопка не Главная', and_wait())

        log('Проверяем, что Главная кнопка по нажатию ENTER вызывает диалог')
        b.button_3.type_in(Keys.ENTER)
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на Главную кнопку'),
                    'Текст в диалоге должен быть \'Вы нажали на Главную кнопку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Проверяем возможность убрать - Главность кнопки')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 1').setPrimary(false);")
        assert_that(lambda: self.primary_button in b.button_1.get_attribute('class'), is_(False),
                    'Первая кнопка Главная', and_wait())

        log('Возвращаем кнопку в обратное состояние')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 1').setPrimary(true);")
        assert_that(lambda: self.primary_button in b.button_1.get_attribute('class'), is_(True),
                    'Первая кнопка не Главная', and_wait())

        log('Делаем кнопку невидимой')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 1').setVisible(false)")
        assert_that(b.button_1, is_not_displayed(), 'Кнопка должна быть невидимой', and_wait())

        log('Проверяем, что вторая кнопка нам невидима, но есть на странице')
        assert_that(b.button_2, is_not_displayed(), 'Кнопка видна на странице', and_wait())
        assert_that(b.button_2, is_present(), 'Кнопка отсутствует в DOM', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 2').setVisible(true);")
        assert_that(b.button_2, is_displayed(), 'Кнопка так и не появилась на странице', and_wait())
        assert_that(lambda: b.button_2.get_attribute('title'), equal_to('443556'),
                    'У кнопки нет всплывающей подсказки', and_wait())

        log('Назначаем главной другую кнопку')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 1').setPrimary(false);")
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 2').setPrimary(true);")
        assert_that(lambda: self.primary_button in b.button_1.get_attribute('class'), is_(False),
                    'Первая кнопка Главная', and_wait())
        assert_that(lambda: self.primary_button in b.button_2.get_attribute('class'), is_(True),
                    'Вторая кнопка не Главная', and_wait())
        b.button_2.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на Простую кнопку'),
                    'Текст в диалоге должен быть \'Вы нажали на Простую кнопку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Работаем с неактивной кнопкой')
        assert_that(lambda: self.disabled in b.button_3.get_attribute('class'), is_(True),
                    'Кнопка отображается как активная', and_wait())
        b.button_3.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не открылся', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 3').setEnabled(true);")
        assert_that(lambda: self.enabled in b.button_3.get_attribute('class'), is_(True),
                    'Кнопка отображается как неактивная', and_wait())
        b.button_3.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на Неактивную кнопку'),
                    'Текст в диалоге должен быть \'Вы нажали на Неактивную кнопку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Меняет текст кнопки')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 3').setCaption('Привет Ара');")
        assert_that(lambda: b.button_3.text, equal_to('Привет Ара'),
                    'Текст у кнопки должен быть \'Привет Ара\'', and_wait())

        log('Проверяем, что у кнопки нет тултипа')
        assert_that(lambda: b.button_3.get_attribute('title'), equal_to(''), 
                    'У кнопки есть всплаывающая подсказка', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Button 3').setTooltip('Привет бро');")
        assert_that(lambda: b.button_3.get_attribute('title'), equal_to('Привет бро'),
                    'У кнопки нет всплаывающей подсказки', and_wait())

    def test_03_button_icon(self):
        """03. Тест проверки кнопки в виде иконки"""

        log('Проверяем кнопку в виде иконки')
        b = Button(self)
        assert_that(lambda: 'controls-IconButton' in b.icon_button.get_attribute('class'), is_(True),
                    'Кнопка не ввиде иконки', and_wait())
        assert_that(lambda: self.icon32 in b.icon_button.get_attribute('class'), is_(True),
                    'У иконки размер не 32х32', and_wait())
        i_name = self.browser.execute_script("return $ws.single.ControlStorage.getByName('IconButton 1').getIcon();")
        delay(0.5)
        assert_that(i_name, equal_to('sprite:icon-32 icon-Microphone icon-primary'),
                    'У кнопки должна быть иконка icon-Microphone')

        log('Меняем иконку')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('IconButton 1')."
                                    "setIcon('sprite:icon-16 icon-Successful icon-primary');")
        i_name2 = self.browser.execute_script("return $ws.single.ControlStorage.getByName('IconButton 1').getIcon();")
        assert_that(lambda: self.icon16 in b.icon_button.get_attribute('class'), is_(True),
                    'У иконки размер не 16х16', and_wait())
        assert_that(i_name2, equal_to('sprite:icon-16 icon-Successful icon-primary'),
                    'У кнопки должна быть иконка icon-Successful')

        log('Скрываем иконку')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('IconButton 1').setVisible(false);")
        assert_that(b.icon_button, is_not_displayed(), 'Иконка все еще видна', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('IconButton 1').setVisible(true);")
        assert_that(b.icon_button, is_displayed(), 'Иконка не видна на странице', and_wait())

        log('Нажимаем на иконку')
        b.icon_button.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на кнопку иконку'),
                    'Текст в диалоге должен быть \'Вы нажали на кнопку иконку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Делаем кнопку неактивной')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('IconButton 1').setEnabled(false);")
        b.icon_button.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог открылся', and_wait())

    def test_04_button_link(self):
        """03. Тест проверки кнопок-ссылок"""

        log('Проверяем, что первая кнопка Главная')
        b = Button(self)
        assert_that(lambda: b.link_1.text, equal_to('Ссылка'), 'Текст у ссылки должен быть \'Ссылка\'', and_wait())

        log('Проверяем, что по нажатию на ссылку открывается диалог')
        b.link_1.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на ссылку'),
                    'Текст в диалоге должен быть \'Вы нажали на ссылку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Делаем кнопку невидимой')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 1').setVisible(false)")
        assert_that(b.link_1, is_not_displayed(), 'Кнопка не должна быть видимой', and_wait())

        log('Проверяем, что вторая ссылка нам не видима, но есть на странице')
        assert_that(b.link_2, is_not_displayed(), 'Ссылка видна на странице', and_wait())
        assert_that(b.link_2, is_present(), 'Ссылка отсутствует в DOM', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 2').setVisible(true);")
        assert_that(b.link_2, is_displayed(), 'Ссылка так и не появилась на странице', and_wait())
        assert_that(lambda: b.link_2.get_attribute('title'), equal_to(''), 
                    'У кнопки есть всплывающая подсказка', and_wait())

        log('Работаем с неактивной ссылкой')
        assert_that(lambda: self.disabled in b.link_2.get_attribute('class'), is_(True),
                    'Ссылка отображается как активная', and_wait())
        b.link_2.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не открылся', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 2').setEnabled(true);")
        assert_that(lambda: self.enabled in b.link_2.get_attribute('class'), is_(True),
                    'Ссылка отображается как неактивная', and_wait())
        b.link_2.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на некативную ссылку'),
                    'Текст в диалоге должен быть \'Вы нажали на некативную ссылку\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

        log('Меняет текст ссылки')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 2').setCaption('Привет Ара link');")
        assert_that(lambda: b.link_2.text, equal_to('Привет Ара link'), 'Текст у кнопки не сменился', and_wait())

        log('Проверяем, что у бывшей неактивной ссылки нет тултипа')
        assert_that(lambda: b.link_2.get_attribute('title'), equal_to(''), 
                    'У ссылки есть всплывающая подсказка', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 2').setTooltip('Привет бро link');")
        assert_that(lambda: b.link_2.get_attribute('title'), equal_to('Привет бро link'),
                    'У ссылки нет всплывающей подсказки', and_wait())

        log('Проверяем ссылку с иконкой')
        assert_that(b.icon_link, is_displayed(), 'Иконка с сылкой не появилась на странице', and_wait())
        assert_that(lambda: b.icon_link.text, equal_to('Ссылка с иконкой'),
                    'У ссылки должен быть другой \'Ссылка с иконкой\'', and_wait())

        log('Проверяем, что у ссылки есть иконка')
        assert_that(b.icon_link.element('i'), is_displayed(), 'У ссылки нет иконки', and_wait())
        assert_that(lambda: self.icon32 in b.icon_link.element('i').get_attribute('class'), is_(True),
                    'Размер иконки не 32x32', and_wait())

        log('Меняем текст ссылки с иконкой')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('Link 3').setCaption('Привет Ара link 2');")
        assert_that(lambda: b.icon_link.text, equal_to('Привет Ара link 2'),
                    'Текст у кнопки не сменился', and_wait())

        log('Проверяем, что кнопка работает')
        b.icon_link.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на ссылку с иконкой'),
                    'Текст в диалоге должен быть \'Вы нажали на ссылку с иконкой\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'диалог не закрылся', and_wait())

        log('Проверяем, что кнопка работает при нажатии на иконку')
        b.icon_link.element('i').click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на ссылку с иконкой'),
                    'Текст в диалоге должен быть \'Вы нажали на ссылку с иконкой\'', and_wait())
        b.ok_alert.click()
        assert_that(b.ok_alert, is_not_displayed(), 'Диалог не закрылся', and_wait())

    def test_05_menu_button(self):
        """05. Тест проверки кнопок-меню"""

        log('Меняем имя у кнопки меню')
        b = Button(self)
        assert_that(lambda: b.menu_button.text, equal_to('Кнопка с меню'),
                    'У кнопки должно быть имя \'Кнопка с меню\'', and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('MenuButton 1').setCaption('ara');")
        assert_that(lambda: b.menu_button.text, equal_to('ara'), 'у кнопки должно быть имя \'ara\'', and_wait())

        log('Открываем меню')
        b.menu_button.click()
        assert_that(b.menu_item1, is_displayed(), 'Меню не открылось', and_wait())
        b.menu_item1.click()
        assert_that(b.menu_item1, is_not_displayed(), 'Меню не закрылось', and_wait())

        log('Проверяем, что при disabled меню не открывается')
        self.browser.execute_script("$ws.single.ControlStorage.getByName('MenuButton 1').setEnabled(false);")
        b.menu_button.click()
        assert_that(b.menu_item1, is_not_displayed(), 'Меню открылось', and_wait())

    def test_06_menu_button_bug878567(self):
        """06. Тест проверки кнопок-меню по ошибке 878567
            Как повторить: Нужно создать кнопку меню задизабленной, а потом сделать setEnabled.
            Кликаем - открывается меню на него можно кликать, а событие onMenuItemActivate не приходит
        """

        log('Меняем имя у кнопки меню')
        b = Button(self)
        assert_that(lambda: self.disabled in b.menu_button2.css_class, is_(True),
                    'у кнопки нет класса {0}'.format(self.enabled), and_wait())
        self.browser.execute_script("$ws.single.ControlStorage.getByName('MenuButton 2').setEnabled(true);")
        assert_that(lambda: self.enabled in b.menu_button2.css_class, is_(True),
                    'у кнопки нет класса {0}'.format(self.enabled), and_wait())

        log('Открываем меню')
        b.menu_button2.click()
        assert_that(b.menu_item3, is_displayed(), 'Меню не открылось', and_wait())
        b.menu_item3.click()
        assert_that(b.ok_alert, is_displayed(), 'Диалог не открылся', and_wait())
        assert_that(lambda: b.alert_text.text, equal_to('Вы нажали на пункт из выпадающего меню'),
                    'Текст в диалоге должен быть \'Вы нажали на пункт из выпадающего меню\'', and_wait())

if __name__ == '__main__':
    run_tests()