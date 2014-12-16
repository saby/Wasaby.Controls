<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<!--
		Описание: Подготовка сертификата к печати;
		Входные данные: xsl документ содержащий данные о сертификате (только одном!);
		Выходные данные: html документ, который будет отправлен на печать.
	-->
	<xsl:template match="/">
		<html>
			<head>
			<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
         <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<title>Бланк сертификата</title>
			<style>
				body {
					font-family: tahoma,verdana,arial;
					font-size: 8.0pt;
					margin-left: 5.0pt;
					margin-top: 5.0pt;
					margin-right: 5.0pt;
					margin-bottom: 5.0pt;
					display: block;
				}
				@media SCREEN {
					body {
						font-family: tahoma,verdana,arial;
						font-size: 8.0pt;
						margin-left: 5.0pt;
						margin-top: 5.0pt;
						margin-right: 5.0pt;
						margin-bottom: 5.0pt;
						display: block;
					}
				}
				div {
					width: auto;
				}
				@page {
					margin-left: 20.0mm;
					margin-top: 10.0mm;
					margin-right: 10.0mm;
					margin-bottom: 10.0mm;
				}
				table {
					font-size: 8.0pt;
					margin-left: 10.0pt;
					margin-top: 0.0;
					margin-right: 0.0;
					margin-bottom: 0.0;
					border-collapse: collapse;
					col-breaks: on;
					width: 98.0%;
				}
				.class_td {
					border-left: 0.0 black;
					border-top: 0.0 black;
					border-right: 0.0 black;
					border-bottom: 0.0 black;
					white-space: nowrap;
					width: 30.0%;
				}
				.class_td2 {
					border-left: 0.0 black;
					border-top: 0.0 black;
					border-right: 0.0 black;
					border-bottom: 0.0 black;
					padding-right: 90px;
				}
				.class_title_center {
					font-family: tahoma,verdana,arial;
					font-size: 9.0pt;
					text-align: center;
					vertical-align: middle;
					font-weight: bold;
				}
            .paragraph{ text-indent: 10px; }
			</style>
			</head>

			<body>

			<!-- Штрих код -->
			<!--
			<div style='font-family: Code 128; text-align: right; font-size: 28pt;'><span>
				<xsl:call-template name="printValue">
					<xsl:with-param name="records" select="//Поле"/>
					<xsl:with-param name="field_name">Отпечаток</xsl:with-param>
				</xsl:call-template>
			</span></div><br/>
			-->

			<!--<div style="height:66px; overflow:hidden; text-align:center;">-->
				<img align="left" width="66" style="position:absolute;right:10px;top:30px;">
					<xsl:attribute name="src">
						<xsl:value-of select="//Поле[@Имя='Image']/."/>
					</xsl:attribute>
					<xsl:attribute name="alt">
						<xsl:value-of select="//Поле[@Имя='Отпечаток']/."/>
					</xsl:attribute>
				</img>
			<!--</div>-->

			<!-- Заголовок страницы -->

			<snap>
			<div class='class_title_center'>ООО &quot;Компания &quot;Тензор&quot;, Сертификат ключа проверки электронной подписи</div>
			</snap>

			<b>Владелец сертификата:</b>

			<table>

			<xsl:call-template name="printLine">
				<xsl:with-param name="records" select="//Поле"/>
				<xsl:with-param name="field_name">ФИО</xsl:with-param>
				<xsl:with-param name="field_title">Фамилия Имя Отчество</xsl:with-param>
			</xsl:call-template>

            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">Организация</xsl:with-param>
               <xsl:with-param name="field_title">Организация</xsl:with-param>
            </xsl:call-template>

            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">СыройИНН</xsl:with-param>
               <xsl:with-param name="field_title">ИНН</xsl:with-param>
            </xsl:call-template>

			<xsl:call-template name="printLine">
				<xsl:with-param name="records" select="//Поле"/>
				<xsl:with-param name="field_name">НеструктурированноеИмя</xsl:with-param>
				<xsl:with-param name="field_title">Неструктурированное имя</xsl:with-param>
			</xsl:call-template>

            <xsl:if test='//Поле[@Имя="Должность"] != "" or //Поле[@Имя="Подразделение"] != ""'>
               <tr>
                  <td class="class_td">Должность, Подразделение</td>
                  <td class="class_td2"><xsl:call-template name="postUnit"/></td>
               </tr>
            </xsl:if>

            <!--<xsl:if test='//Поле[@Имя="Страна"]/.'>-->
               <tr>
                  <td class="class_td">Страна, Область, Город, Улица</td>
                  <td class="class_td2"><xsl:call-template name="countryAreaCity"/></td>
               </tr>
            <!--</xsl:if>-->

			<xsl:call-template name="printLine">
				<xsl:with-param name="records" select="//Поле"/>
				<xsl:with-param name="field_name">ЭлектроннаяПочта</xsl:with-param>
				<xsl:with-param name="field_title">E-Mail</xsl:with-param>
			</xsl:call-template>

            <xsl:if test='//Поле[@Имя="РегНомерФСС"] != "" or //Поле[@Имя="КодПодразделенияФСС"] != ""'>
               <tr>
                  <td>Рег. номер, код подр. в ФСС</td>
                  <td><xsl:call-template name="regNomFSS"/></td>
               </tr>
            </xsl:if>

            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">СНИЛС</xsl:with-param>
               <xsl:with-param name="field_title">СНИЛС</xsl:with-param>
            </xsl:call-template>

            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">ОГРН</xsl:with-param>
               <xsl:with-param name="field_title">ОГРН</xsl:with-param>
            </xsl:call-template>

            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">ОГРНИП</xsl:with-param>
               <xsl:with-param name="field_title">ОГРНИП</xsl:with-param>
            </xsl:call-template>

			</table>

			<b>Издатель сертификата:</b>
			<br/>

			<span>
			<div style='margin-left:10pt;'>
				<!--<span>CN=TENSORCA1, OU=Удостоверяющий центр, O=ООО Компания Тензор, L=Ярославль, C=RU, E=root@nalog.tensor.ru</span>-->
				<xsl:call-template name="printValue">
					<xsl:with-param name="records" select="//Поле"/>
					<xsl:with-param name="field_name">Издатель</xsl:with-param>
				</xsl:call-template>
			</div>
			</span>

			<b>Срок действия по UTC:</b>

			<!--<table>-->
				<xsl:call-template name="printLine">
					<xsl:with-param name="records" select="//Поле"/>
					<xsl:with-param name="field_name">ДействителенС</xsl:with-param>
					<xsl:with-param name="field_title"> с </xsl:with-param>
				</xsl:call-template>

				<xsl:call-template name="printLine">
					<xsl:with-param name="records" select="//Поле"/>
					<xsl:with-param name="field_name">ДействителенПо</xsl:with-param>
					<xsl:with-param name="field_title"> по </xsl:with-param>
				</xsl:call-template>
			<!--</table>-->
         <br/>

			<b>Расширения сертификата X.509</b>
			<br/>

			<span>
			<xsl:call-template name="printEnhancedKey"/>

			<xsl:call-template name="printCertificatePolicy">
				<xsl:with-param name="policy_id">
					<xsl:call-template name="printValue">
						<xsl:with-param name="records" select="//Поле"/>
						<xsl:with-param name="field_name">ПолитикиСертификата</xsl:with-param>
					</xsl:call-template>
				</xsl:with-param>
			</xsl:call-template>

         <span>
         <div style='margin-left:10pt;'>
            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">СредствоЭПВладельца</xsl:with-param>
               <xsl:with-param name="field_title">Расширение 1.2.643.100.111 "Средство электронной подписи владельца": </xsl:with-param>
            </xsl:call-template>
         </div>
         </span>
         <span>
         <div style='margin-left:10pt;'>
            <xsl:call-template name="printLine">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">СредствоЭПиУЦИздателя</xsl:with-param>
               <xsl:with-param name="field_title">Расширение 1.2.643.100.112 "Средства электронной подписи и УЦ издателя": </xsl:with-param>
            </xsl:call-template>
         </div>
         </span>
         <xsl:call-template name="subjectKey"/>
			</span>

         <div>
            <b>Серийный номер: </b>
            <xsl:call-template name="printSerialNumber"/>
            <b>Отпечаток: </b>

            <xsl:call-template name="printValue">
               <xsl:with-param name="records" select="//Поле"/>
               <xsl:with-param name="field_name">Отпечаток</xsl:with-param>
            </xsl:call-template>
         </div>

         <b>Ключ проверки электронной подписи</b>

			<span>
			<xsl:call-template name="printPublicKey"/>
			</span>

         <b>Подпись Удостоверяющего центра</b>

         <xsl:call-template name="signatureUC"/>

			<!-- подпись и печать -->

			<br/>
         <div>
            <table>
               <tr>
                  <td><div style="float:left;">"___"___________________20___г.</div></td>
                  <td><div style="float:right;margin-right: 30px;">Сертификат получил(а): ___________________ /____________________/</div></td>
               </tr>
               <tr>
                  <td></td>
                  <td><div style='text-align: right;'>
                         <span style='color: #999999;padding-right: 70px;' >подпись</span>
                         <span style='color: #999999;padding-right: 27px;' >расшифровка</span>
                          М. П.</div></td>
               </tr>
            </table>
         </div>

         <div style="font-size: 9.0pt;font-weight: bold;">Соглашение об использовании электронной подписи для обмена электронными документами</div>
         <div>
            <div class="paragraph">Владелец сертификата соглашается с возможностью использования данной электронной подписи при обмене
               электронными документами со своими контрагентами.
            </div>
            <div class="paragraph">Электронная подпись документов, выполненная с помощью закрытого ключа, соответствующего данному открытому
            ключу, признается равнозначной собственноручной подписи владельца сертификата и порождает для подписанта
            юридические последствия в виде установления, изменения и прекращения прав и обязанностей при
            одновременном соблюдении, следующих условий:</div>
            <div class="paragraph">- электронная подпись выполнена в течение срока действия данного сертификата;</div>
            <div class="paragraph">- электронная подпись используется с учетом ограничений, содержащихся в квалифицированном сертификате
            лица, подписывающего электронный документ (если такие ограничения установлены);</div>
            <div class="paragraph">- сертификат в данный период был действительным и не был отозван;</div>
            <div class="paragraph">При соблюдении условий, приведенных выше, электронный документ, содержание которого соответствует
            требованиям нормативных правовых актов, может приниматься участниками обмена к учету в качестве
            первичного учетного документа, использоваться в качестве доказательства в судебных разбирательствах,
            предоставляться в государственные органы по запросам последних.</div>
            <div class="paragraph">Наличие данного соглашения не отменяет использование иных способов изготовления и обмена документами
            между компанией владельца сертификата и ее контрагентами.</div>
         </div>
         <br/>
         <div>
            <table>
                <tr>
                    <td><div style="float:left;">"___"___________________20___г.</div></td>
                    <td><div style="float:right;margin-right: 30px;">Согласие предоставил(а): ___________________/____________________/</div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td><div style='text-align: right;'>
                            <span style='color: #999999;padding-right: 70px;'>подпись</span>
                            <span style='color: #999999;padding-right: 27px;'>расшифровка</span>
                            М. П.</div>
                    </td>
                </tr>
            </table>
         </div>
         </body>
		</html>
	</xsl:template>

	<!--******************************************-->
	<xsl:template name="whileEnhancedKey">
		<xsl:param name="str"/>
		<xsl:variable name="symbol">;</xsl:variable>
		
		<xsl:if test="contains($str, $symbol)">
			<div>
				<xsl:value-of select="substring-before($str, $symbol)"/>
			</div>
			
			<xsl:call-template name="whileEnhancedKey">
				<xsl:with-param name="str" select="substring-after($str, $symbol)"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	
	<!--******************************************-->
	<xsl:template name="printEnhancedKey">
		<div style="margin-left: 10.0pt;">Расширение 2.5.29.37 "Улучшенный ключ":</div>

		<div style="margin-left: 20.0pt;">
         <xsl:for-each select="//Поле[@Имя='УлучшенныйКлюч']//Запись[@ПолеКлюча='OID']">
            <xsl:choose>
               <xsl:when test='.//Поле[@Имя="Описание"]//Текст'>
                  <xsl:choose>
                     <xsl:when test='(Поле[@Имя="Описание"]="")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Текст"/><span>; </span>
                     </xsl:when>
                     <xsl:when test='(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Текст"/><span>; </span>
                     </xsl:when>
                     <xsl:when test='not(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='Описание']//Текст"/>
                        (<xsl:value-of select=".//Поле[@Имя='OID']//Текст"/>)<span>; </span>
                     </xsl:when>
                  </xsl:choose>
               </xsl:when>

               <xsl:when test='.//Поле[@Имя="Описание"]//Строка'>
                  <xsl:choose>
                     <xsl:when test='(Поле[@Имя="Описание"]="")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Строка"/><span>; </span>
                     </xsl:when>
                     <xsl:when test='(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Строка"/><span>; </span>
                     </xsl:when>
                     <xsl:when test='not(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='Описание']//Строка"/>
                        (<xsl:value-of select=".//Поле[@Имя='OID']//Строка"/>)<span>; </span>
                     </xsl:when>
                  </xsl:choose>
               </xsl:when>
            </xsl:choose>
         </xsl:for-each>
		</div>
	</xsl:template>

	<!--******************************************-->

   <xsl:template name="postUnit">
      <xsl:variable name="post" select="//Поле[@Имя='Должность']/."/>
      <xsl:variable name="unit" select="//Поле[@Имя='Подразделение']/."/>
      <xsl:value-of select="$post"/>
      <xsl:if test='not($post="") and not($unit="")'>
      ,
      </xsl:if>
      <xsl:value-of select="$unit"/>
   </xsl:template>

   <!--******************************************-->

   <xsl:template name="countryAreaCity">
      <xsl:variable name="country" select="//Поле[@Имя='Страна']/."/>
      <xsl:variable name="area" select="//Поле[@Имя='Регион']/."/>
      <xsl:variable name="city" select="//Поле[@Имя='Город']/."/>
      <xsl:variable name="strit" select="//Поле[@Имя='Улица']/."/>
      <xsl:value-of select="$country"/>
      <xsl:if test='not($country="") and not($area="")'>
      ,
      </xsl:if>
      <xsl:value-of select="$area"/>
      <xsl:if test='not($city="") and not($area="")'>
      ,
      </xsl:if>
      <xsl:value-of select="$city"/>
      <xsl:if test='not($strit="") and not($city="")'>
      ,
      </xsl:if>
      <xsl:value-of select="$strit"/>
   </xsl:template>

   <!--******************************************-->

   <xsl:template name="regNomFSS">
      <xsl:variable name="regNom" select="//Поле[@Имя='РегНомерФСС']/."/>
      <xsl:variable name="FSS" select="//Поле[@Имя='КодПодразделенияФСС']/."/>
      <xsl:value-of select="$regNom"/>
      <xsl:if test='not($regNom="") and not($FSS="")'>
         ,
      </xsl:if>
      <xsl:value-of select="$FSS"/>

   </xsl:template>

   <!--******************************************-->
	<xsl:template name="printCertificatePolicy">
		<xsl:param name="policy_id"></xsl:param>

		<xsl:if test='not($policy_id="")'>
      <div style="margin-left: 10.0pt;">Расширение 2.5.29.32 "Политики сертификата":
         <xsl:for-each select="//Поле[@Имя='ПолитикиСертификата']//Запись[@ПолеКлюча='OID']">

            <xsl:choose>
               <xsl:when test='.//Поле[@Имя="Описание"]//Текст'>
                  <xsl:choose>
                     <xsl:when test='(Поле[@Имя="Описание"]="")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Текст"/>
                        <span>; </span>
                     </xsl:when>
                     <xsl:when test='(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Текст"/>
                        <span>; </span>
                     </xsl:when>
                     <xsl:when test='not(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='Описание']//Текст"/>
                        (<xsl:value-of select=".//Поле[@Имя='OID']//Текст"/>)
                        <span>; </span>
                     </xsl:when>
                  </xsl:choose>
               </xsl:when>

               <xsl:when test='.//Поле[@Имя="Описание"]//Строка'>
                  <xsl:choose>
                     <xsl:when test='(Поле[@Имя="Описание"]="")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Строка"/>
                        <span>; </span>
                     </xsl:when>
                     <xsl:when test='(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='OID']//Строка"/>
                        <span>; </span>
                     </xsl:when>
                     <xsl:when test='not(Поле[@Имя="Описание"]="null")'>
                        <xsl:value-of select=".//Поле[@Имя='Описание']//Строка"/>
                        (<xsl:value-of select=".//Поле[@Имя='OID']//Строка"/>)
                        <span>; </span>
                     </xsl:when>
                  </xsl:choose>
               </xsl:when>
            </xsl:choose>

         </xsl:for-each>
            <!--<xsl:call-template name="whileEnhancedKey">-->
               <!--<xsl:with-param name="str" select="//Поле[@Имя='ИдентификаторПолитики']/."/>-->
            <!--</xsl:call-template>-->
         </div>
		</xsl:if>
	</xsl:template>

	<!--******************************************-->
   <xsl:template name="signatureUC">
   		<xsl:param name="signatureUC_id"></xsl:param>
         Алгоритм подписи:
            <xsl:for-each select="//Поле">
               <xsl:if test='@Имя="АлгоритмПодписи"'>
                  <xsl:value-of  select="."/>
               </xsl:if>
            </xsl:for-each>
         <div style="margin-left: 20.0pt;">Значение:
            <xsl:for-each select="//Поле">
               <xsl:if test='@Имя="Подпись"'>

                  <xsl:call-template name="addWhiteSpaces">
                     <xsl:with-param name="str" select="."/>
                  </xsl:call-template>

               </xsl:if>
            </xsl:for-each>
         </div>
   	</xsl:template>

   <!--******************************************
   <xsl:template name="printCertificatePolicy_">
      <div style="margin-left: 10.0pt;">Расширение 1.2.643.100.111 "Средство электронной подписи владельца": "КриптоПро CSP" (версия 3.6)</div>
      <div style="margin-left: 10.0pt;">Расширение 1.2.643.100.112 "Средства электронной подписи и УЦ издателя": "КриптоПро CSP" (версия 3.6) Заключение на средство ЭП:</div>
      <div style="margin-left: 10.0pt;">Cертификат соответствия СФ/121-1859 от 17.06.2012 Средство УЦ: "Удостоверяющий Центр "КриптоПро УЦ" версии 1.5 Заключение на средство УЦ:</div>
      <div style="margin-left: 10.0pt;">СФ 128/1658 от 01 мая 2011 г.</div>
   </xsl:template>
   -->
   <!--******************************************-->
	<xsl:template name="addWhiteSpaces">
		<xsl:param name="str"/>

		<xsl:if test="string-length($str)>1">
			<xsl:value-of select="concat(substring($str, 1, 2), ' ')"/>

			<xsl:call-template name="addWhiteSpaces">
				<xsl:with-param name="str" select="substring($str, 3)"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>

	<!--******************************************-->
	<xsl:template name="printSerialNumber">
		<xsl:for-each select="//Поле">
			<xsl:if test='@Имя="СерийныйНомер"'>

				<xsl:call-template name="addWhiteSpaces">
					<xsl:with-param name="str" select="."/>
				</xsl:call-template>

			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<!--******************************************-->
	<xsl:template name="printPublicKey">
      Алгоритм ключа: ГОСТ Р 34.10-2001
      <div style="margin-left: 20.0pt;">Значение:
		<xsl:for-each select="//Поле">
			<xsl:if test='@Имя="ОткрытыйКлюч"'>

				<xsl:call-template name="addWhiteSpaces">
					<xsl:with-param name="str" select="."/>
				</xsl:call-template>

			</xsl:if>
		</xsl:for-each>
      </div>
	</xsl:template>

	<!--******************************************-->
   	<xsl:template name="subjectKey">
         <div style="margin-left: 10.0pt;">Расширение 2.5.29.14 "Идентификатор ключа субъекта":
   		<xsl:for-each select="//Поле">
   			<xsl:if test='@Имя="ИдКлючаСубъекта"'>

   				<xsl:call-template name="addWhiteSpaces">
   					<xsl:with-param name="str" select="."/>
   				</xsl:call-template>

   			</xsl:if>
   		</xsl:for-each>
         </div>
   	</xsl:template>
	<!--******************************************-->
	<xsl:template name="printValue">
		<xsl:param name="records" />
		<xsl:param name="field_name" />

		<xsl:value-of select="$records[@Имя=$field_name]/."/>

	</xsl:template>

	<!--******************************************-->
	<xsl:template name="printLine">
		<xsl:param name="records" />
		<xsl:param name="field_name" />
		<xsl:param name="field_title" />

		<xsl:for-each select="$records">
			<xsl:if test='@Имя=$field_name and not(.="")'>
				<tr>
					<td class="class_td">
						<xsl:value-of select="$field_title"/>
					</td>
					<td class="class_td2">
						<xsl:apply-templates/>
					</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<!-- Скопировано из файла defaul-list-transform.xls -->
   <xsl:template match="Текст|Строка|Логическое">
		<xsl:value-of select="." />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="Время">
      <xsl:value-of select="substring(.,1,8)" />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="Дата">
      <xsl:value-of select="concat(substring(.,9,2), '.', substring(.,6,2), '.', substring(.,3,2))" />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="ДатаИВремя">
      <xsl:value-of select="concat(substring(.,9,2), '.', substring(.,6,2), '.', substring(.,3,2), ' ', substring(.,12,8))" />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="Перечисляемое">
      <xsl:value-of select="./Вариант[@Выбран='true']/@Название" />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="Флаги">
      <xsl:apply-templates select="./Флаг[@Состояние='true']" />
   </xsl:template>
	<!--******************************************-->
   <xsl:template match="Флаг">
      <xsl:value-of select="./@Название" />
   </xsl:template>
	<!--******************************************-->
</xsl:stylesheet>