<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

   <xsl:output method="html" indent="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" doctype-system="http://www.w3.org/TR/html4/loose.dtd" />

   <xsl:template match="/">
      <html>
      <head>
         <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body>
         <table>
            <xsl:apply-templates select="/Запись/Поле" />
         </table>
      </body>
      </html>
   </xsl:template>

   <xsl:template match="Поле">
      <tr>
         <td><xsl:value-of select="./@Имя" /></td>
         <td>
            <xsl:apply-templates select="./*" />
         </td>
      </tr>
   </xsl:template>

   <xsl:template match="Строка">
      <xsl:value-of select="." />
   </xsl:template>

   <xsl:template match="ЧислоЦелое">
      <xsl:value-of select="." />
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

   <xsl:template match="Выборка">
   </xsl:template>

</xsl:stylesheet>