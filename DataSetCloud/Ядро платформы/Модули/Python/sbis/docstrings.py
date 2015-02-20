# данный модуль генерирует содержательные строки документации для перечисляемых значений. Описание полей перечисляемого
# типа берется из файла docstrings.xml, иначе строка будет содержать просто список доступных атрибутов. Файл docstrings.xml
# должен дополняться и исправляться вручную по мере внесения изменений в sbis-python.cpp.
# автор: Т.Шувалова
# Данный модуль нуждается в капитальном ремонте (В. Керимов)

import sbis

def DocstringsWriter():
    methods_to_document = dict()
    classes_to_document = dict()
    import xml.etree.ElementTree as etree
    import os
    docsxmlpath = __file__.split(os.path.basename(__file__))[0]
    tree = etree.parse(os.path.join(docsxmlpath, 'docstrings.xml'))
    root = tree.getroot()
    methods = root.findall("sbis_methods")[0].getchildren()
    classes = root.findall("sbis_classes")[0].getchildren()
    for method in methods:
        methods_to_document[method.tag] = method.text
    for cls in classes:
        classes_to_document[cls.tag] = dict()
        clsprops = cls.getchildren()
        for prop in clsprops:
             classes_to_document[cls.tag][prop.tag] = prop.text
    set_sbismethods_docstrings(methods_to_document)
    set_sbisclasses_docstrings(classes_to_document)

def set_sbismethods_docstrings(methods_to_document):
     sbis_members = sbis.__dir__()
     for sbis_class in sbis_members:
         if sbis_class in methods_to_document.keys():
             docs_method = eval('sbis.' + sbis_class)
             docs_method.__doc__ = str(methods_to_document[sbis_class])

def set_sbisclasses_docstrings(classes_to_document):
     sbis_enums = [item for item in classes_to_document if item in sbis.__dict__]
     for enum in classes_to_document:
         enum_docstring = ""
         if sbis.__dict__[enum].__doc__ is not None:
             enum_docstring += sbis.__dict__[enum].__doc__ + '. Доступны следующие атрибуты:'
         else:
             enum_docstring += str(enum) + '. Доступны следующие атрибуты:'
         prop = sbis.__dict__[enum].__dict__
         enum_attribs = [elem for elem in prop if type(prop[elem]).__name__ in sbis.wrap.__dict__]
         if enum in classes_to_document:
             for en_at in enum_attribs:
                enum_docstring += ('\n\n\n' + en_at)
                if en_at in classes_to_document[enum]:
                    if classes_to_document[enum][en_at] is not None:
                        enum_docstring += (' - ' + classes_to_document[enum][en_at])
         if enum_docstring != "":
             sbis.__dict__[enum].__doc__ = enum_docstring
