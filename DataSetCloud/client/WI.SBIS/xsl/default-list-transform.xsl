<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:output method="html" encoding="utf-8" indent="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd" />

   <xsl:variable name="paddingValue" select="10" />
   <xsl:variable name="hierarchyField" select="./Выборка/@ПолеИерархии" />
   <xsl:variable name="hierarchyName" select="./Выборка/@ИмяИерархии" />
   <xsl:variable name="columnsCount" select="count(./Выборка/Колонки/Колонка)" />
   <xsl:variable name="hasHierarchy" select="count($hierarchyField) > 0" />
   <xsl:variable name="rootNode" select="./Выборка/@Корень" />
   <xsl:variable name="root" select="." />


   <xsl:template match="/">

      <html>
      <head>
         <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
         <style type="text/css" media="all">
            * {
               font-family: Tahoma;
               font-size: 11px;
            }
            .ws-register-table {
               width: 100%;
               border: 1px solid #A9A9A9;
               border-collapse: collapse;
            }
            .ws-register-table th,
            .ws-register-table td {
               border: 1px solid #A9A9A9;
               padding: 1px 5px;
            }
            .ws-register-table td.ws-register-folder {
               font-weight: bold;
            }
         </style>
      </head>
      <body>
         <table class="ws-register-table">
            <thead>
               <tr>
                  <xsl:for-each select="/Выборка/Колонки/Колонка">
                     <th>
                        <xsl:value-of select="@Имя" />
                     </th>
                  </xsl:for-each>
               </tr>
            </thead>
            <tbody>
               <xsl:if test="$hasHierarchy">
                  <xsl:call-template name="oneRow">
                     <xsl:with-param name="records" select="./Выборка/Запись[count(Поле[@Имя = $hierarchyField and Иерархия/Родитель = $rootNode]) > 0]" />
                  </xsl:call-template>
               </xsl:if>
               <xsl:if test="not($hasHierarchy)">
                  <xsl:call-template name="oneRow">
                     <xsl:with-param name="records" select="./Выборка/Запись" />
                  </xsl:call-template>
               </xsl:if>
            </tbody>
         </table>
      </body>
      </html>
   </xsl:template>

   <xsl:template name="oneRow">
      <xsl:param name="records" />
      <xsl:param name="padding" select="0" />
      <xsl:for-each select="$records">
         <xsl:variable name="record" select="." />
         <xsl:if test="./Поле[@Имя = $hierarchyField]/Иерархия/ТипУзла = 'Узел' and $hasHierarchy">
            <tr>
               <td class="ws-register-folder">
                  <xsl:attribute name="style">
                     <xsl:value-of select="concat('padding-left:', 5 + $padding * $paddingValue, 'px;')" />
                  </xsl:attribute>
                  <xsl:attribute name="colspan">
                     <xsl:value-of select="$columnsCount" />
                  </xsl:attribute>
                  <xsl:value-of select="./Поле[@Имя = $hierarchyName]" />
               </td>
            </tr>
            <xsl:call-template name="oneRow">
               <xsl:with-param name="padding" select="$padding + 1" />
               <xsl:with-param name="records" select="$root/Выборка/Запись[count(Поле[@Имя = $hierarchyField and Иерархия/Родитель = current()/@КлючЗаписи]) > 0]" />
            </xsl:call-template>
         </xsl:if>
         <xsl:if test="./Поле[@Имя = $hierarchyField]/Иерархия/ТипУзла != 'Узел' or not($hasHierarchy)">
            <tr>
               <xsl:for-each select="/Выборка/Колонки/Колонка">
                  <xsl:variable name="field" select="@Поле"/>
                  <xsl:variable name="type" select="name($record/Поле[@Имя = $field]/*[1])"/>
                  <xsl:variable name="isInteger" select="$type = 'ЧислоЦелое'"/>
                  <xsl:variable name="isFloat" select="$type = 'ЧислоВещественное'"/>
                  <td>
                     <xsl:if test="position() = 1">
                        <xsl:attribute name="style">
                           <xsl:value-of select="concat('padding-left:', 5 + $padding * $paddingValue, 'px;')" />
                        </xsl:attribute>
                     </xsl:if>
                     <xsl:if test="$isInteger or $isFloat or ($type = 'Деньги')">
                        <xsl:attribute name="class">
                           <xsl:variable name="className">
                              <xsl:choose>
                                 <xsl:when test="$isInteger">
                                    <xsl:text>integer</xsl:text>
                                 </xsl:when>
                                 <xsl:when test="$isFloat">
                                    <xsl:text>float</xsl:text>
                                 </xsl:when>
                                 <xsl:otherwise>
                                    <xsl:text>money</xsl:text>
                                 </xsl:otherwise>
                              </xsl:choose>
                           </xsl:variable>
                           <xsl:value-of select="concat('ws-browser-type-', $className)" />
                        </xsl:attribute>
                     </xsl:if>
                     <xsl:if test="$record/Поле[@Имя = $field] != 'null'">
                        <xsl:apply-templates select="$record/Поле[@Имя = $field]" />
                     </xsl:if>
                  </td>
               </xsl:for-each>
            </tr>
         </xsl:if>
      </xsl:for-each>
   </xsl:template>

   <xsl:template match="ЧислоЦелое|ЧислоВещественное|Деньги">
      <div style="text-align:right;"><xsl:value-of select="." /></div>
   </xsl:template>

   <xsl:template match="Текст|Строка|Логическое">
      <xsl:value-of select="." />
   </xsl:template>

   <xsl:template match="Время">
      <xsl:value-of select="substring(.,1,8)" />
   </xsl:template>
   <xsl:template match="Дата">
      <xsl:value-of select="concat(substring(.,9,2), '.', substring(.,6,2), '.', substring(.,3,2))" />
   </xsl:template>
   <xsl:template match="ДатаИВремя">
      <xsl:value-of select="concat(substring(.,9,2), '.', substring(.,6,2), '.', substring(.,3,2), ' ', substring(.,12,8))" />
   </xsl:template>

   <xsl:template match="Перечисляемое">
      <xsl:value-of select="./Вариант[@Выбран='true']/@Название" />
   </xsl:template>

   <xsl:template match="Флаги">
      <xsl:apply-templates select="./Флаг[@Состояние='true']" />
   </xsl:template>

   <xsl:template match="Флаг">
      <xsl:value-of select="./@Название" />
   </xsl:template>

</xsl:stylesheet>