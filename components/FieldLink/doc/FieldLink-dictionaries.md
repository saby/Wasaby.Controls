���������� - ��� ������ ������ ��������. ����� �������� ������� �������� �� ������ ������ ����������,
������� ����� ������������ ��� {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/components/list/ ����������� ������ � �������}.

��������� �� ������ ����������� �� ������ ��������� {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef �����}.

������� ���������� ����� ����� ���� ������ ������������ ��� � ������� ������ {@link showSelector}.
����� ��� ���� ����� ���������� ������ ���� ����������, ���� �� ������ ���� ���������� ��� ��������.
����� ��� ���� ����� ����������� ��������� ������������, ���� �� ������ ���� ��������� ������� ��� ������ ������� �����������.

������ �������� ���� � ��������� ����������� ��� ���� �����:

1. ���������� ���������, �� ������ �������� ����� �������� ����� �������� ������� ������ ��� ���� �����.
   ���������, ������� ����� ����������� ��� ���������� ������� ������ ��������, ��� ������� �������� �� ������ ��������� ���������.
   ��������, {@link https://wi.sbis.ru/docs/3-8-0/SBIS3/CONTROLS/DataGridView/ DataGridView} ��� {@link https://wi.sbis.ru/docs/3-8-0/SBIS3/CONTROLS/TreeDataGridView/ TreeGridView}. ��� ��������� �� ������� �����-�� ���������.
   
2. ��� ��������������� ����������:
   1. {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/binding-data-and-views/ ���������} � {@link https://wi.sbis.ru/doc/platform/developmentapl/workdata/logicworkapl/logic/source/ �������} �������� ������.
   2. ��������� ����� ������ �������: ��������� ��� �������������.
      ���� ���� ����� ����� ����������� � ����� ���������� ������ ��������, ��������� ������� ����� �������
      ���������� � ��� �� ����� ������. ����� �������� ����� ������������� ������ �� ������� �������� ������.
      ���� ���� ����� ����� ����������� � ����� �������������� ������ ��������, ��������� ������� ����� �������
      ���������� � ��� �� ����� ������ � ������� ����� {@link multiselect}.
      ����� �������� � ���� ����� ����� ��������� �������� � ������ �������������� ������, ����� ������������
      ���������� �� ������� ����� �� ������. � �������� ������ ���������� ��������� ������.
      ��������, ��� {@link SBIS3.CONTROLS.Button} ���������� ������ ��������� ��������� �������:
      <pre>
          this.getChildControlByName('Button').subscribe('onActivated', function() {
             self.sendCommand('close', MyDataGridView.getSelectedKeys());  // ������ ���������� ������� ����� ��������������� ��������� ���������
          });
      </pre>
      ����� ������ ������ ���� ������ ��������� � ������� ����� ����������� ������, � ������ ����������
      ����� ������������ ��������� � ������� "ws-window-titlebar-custom". ��� ���������� CSS-�����. �
      ���������� ���������� ����� ���������� ��������, ������� ����� ���������� ��� ���������� ������.
      <pre class="brush: xml">
         <div class="ws-window-titlebar-custom"> <!-- �� ������ ������� ���������� ��������� CSS-�����, ������� ��������� ��� � ����� ������� ������ -->
            <component data-component="SBIS3.CONTROLS.Button" name="SelectButton" class="controls-demo-FieldLinkDemoTemplate__SelectButton"> <!-- ������������ ������, ������������ ��� ������������� ��������� �������� -->
               <option name="caption">�������</option> <!-- ������������� ������� �� ������ -->
            </component>
         </div>
      </pre>
	  
3. ����������� ���������� � ���� �����. �������������� ��������� ��������� � ����� {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef template}:
   <pre class="brush: xml">
       <options name="dictionaries" type="array">
          <options>
             <option name="template">js!SBIS3.MyArea.MyDict01</option>
             . . .
          </options>
       </options>
   </pre>
   
����� ��� ���� ����� ��������� ����� ������ �� ���������� ������������, ����� ������������ ��������� �����������.
� ���������� ������������ ��� ���� �����, � ����� {@link SBIS3.CONTROLS.FieldLink/Dictionaries.typedef caption} ��� ������� ���������� ������� ������� ��������,
������� ��������� ��� �������� � ���� ������ ������� �����������:
<pre class="brush: xml">
    <options name="dictionaries" type="array">
       <options>
          <option name="caption">������ 1</option>
          <option name="template">js!SBIS3.MyArea.MyDict01</option>
          . . .
       </options>
       <options>
          <option name="caption">������ 2</option>
          <option name="template">js!SBIS3.MyArea.MyDict02</option>
          . . .
       </options>
    </options>
</pre>

����������� ���������� ���� � ����� ����, ���� �� ����������� ������; ������ ����� �����
���������� � ������� ����� {@link chooserMode}.
���������� ����� ������������ ��� ���� ����� ����� � ������� ������ {@link setDictionaries}.
