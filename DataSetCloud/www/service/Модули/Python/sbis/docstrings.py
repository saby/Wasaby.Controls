# -*- coding: utf-8 -*-
#данный модуль генерирует содержательные строки документации для перечисляемых значений. Описание полей перечисляемого
#типа берется из файла docstrings.xml, иначе строка будет содержать просто список доступных атрибутов. Файл docstrings.xml
#должен дополняться и исправляться вручную по мере внесения изменений в sbis-python.cpp.
#автор: Т.Шувалова
def DocstringsWriter():
    methods_to_document = dict()
    classes_to_document = dict()
    import xml.etree.ElementTree as etree
    import os
    docsxmlpath = __file__.split(os.path.basename(__file__))[0]
    tree = etree.parse(os.path.join(docsxmlpath,'docstrings.xml'))
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
    sbis = __import__('sbis')
    set_sbismethods_docstrings(sbis, methods_to_document)
    set_sbisclasses_docstrings(sbis, classes_to_document)
    #Following function generates XML with enums. Path must be given
    #create_XML_with_enums(sbis, "c:\\Project\\sbis3_2\\test\\sbis\\docs3\\Enums.xml")

def create_XML_with_enums(sbis, path):
    from lxml import etree
    root = etree.Element('sbis_classes')
    sbis_members = sbis.__dict__
    sbis_enums = [item for item in sbis_members if str(type(sbis_members[item])) == "<class 'type'>" and ord(item[0]) < 128 and item[0].istitle()]
    sbis_enums.sort()
    for enum in sbis_enums:
        elem = etree.SubElement( root, enum )
        d = sbis_members[enum].__dict__
        enum_attribs = [itm for itm in d if str(type(d[itm])) == "<class 'loader." + enum + "'>"]
        if len(enum_attribs) == 0:
            elem.text = ''
        else:
            enum_attribs.sort()
        for en_at in enum_attribs:
            attrib = etree.SubElement( elem, en_at )
            attrib.text = ''
    new_root_tree = root.getroottree()
    new_root_tree.write(path, encoding='utf-8', method="xml", pretty_print=True, xml_declaration=None, with_tail=True, standalone=None, compression=0, exclusive=False, with_comments=True, inclusive_ns_prefixes=None)

def set_sbismethods_docstrings(sbis, methods_to_document):
     sbis_members = sbis.__dir__()
     for sbis_class in sbis_members:
         if sbis_class in methods_to_document.keys():
             docs_method = eval('sbis.' + sbis_class)
             docs_method.__doc__ = str(methods_to_document[sbis_class])

def set_sbisclasses_docstrings(sbis, classes_to_document):
     sbis_members = sbis.__dict__
     sbis_enums = [item for item in sbis_members if str(type(sbis_members[item])) == "<class 'type'>" and ord(item[0]) < 128 and item[0].istitle()]
     for enum in sbis_enums:
         enum_docstring = ""
         if sbis_members[enum].__doc__ is not None:
             enum_docstring += sbis_members[enum].__doc__ + '. Доступны следующие атрибуты:'
         else:
             enum_docstring += str(enum) + '. Доступны следующие атрибуты:'
         d = sbis_members[enum].__dict__
         enum_attribs = [itm for itm in d if str(type(d[itm])) == "<class 'sbis.wrap." + enum + "'>"]
         if enum in classes_to_document:
             for en_at in enum_attribs:
                enum_docstring += ('\n\n\n'+en_at)
                #enum_docstring += '\n\n<tt class="descname">'+en_at+'</tt>'
                if en_at in classes_to_document[enum]:
                    if classes_to_document[enum][en_at] is not None:

                        enum_docstring += (' - ' + classes_to_document[enum][en_at])

         # print('class: ' + enum + '\n')
         # print('attributes: ' + str(enum_attribs) + '\n')
         # print('Result docstring: ' + enum_docstring + '\n\n')
         if enum_docstring != "":
             sbis_members[enum].__doc__ = enum_docstring