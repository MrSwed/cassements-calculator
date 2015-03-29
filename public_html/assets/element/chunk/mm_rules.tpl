// more example rules are in assets/plugins/managermanager/example_mm_rules.inc.php

// example of how PHP is allowed - check that a TV named documentTags exists before creating rule
if($modx->db->getValue("SELECT COUNT(id) FROM " . $modx->getFullTableName('site_tmplvars') . " WHERE name='documentTags'")) {
    mm_widget_tags('documentTags',' '); // Give blog tag editing capabilities to the 'documentTags (3)' TV
}

mm_widget_showimagetvs(); // Always give a preview of Image TVs

/* Переменные для использования */
$cid = isset($content['id'])?$content['id']:false;
$pid = $cid?$content['parent']:$_GET["pid"];
$tpl = $content['template'];
$pidAr = array_merge(array($pid),$modx->getParentIds($pid)); // роительский путь
/**/


mm_ddMultipleFields('shop_models', '', '6', 'text,text', 'Модель,Цена','','||','==');
mm_ddMultipleFields('shop_parameters', '', '6', 'text,text', 'Название,Значение');
mm_createTab('Магазин','shop','','6');
mm_moveFieldsToTab('price,shop_models,shop_parameters','shop');

mm_ddCreateSection('Параметры (наследуемые, пустое значение наследует родителя)', 'parameters','settings');
mm_ddMoveFieldsToSection('hidePageTitle,hideBreadcrumbs,showParentTitle,showDateInContent,inheritAfterContent,hideRightCol,enableShare,enableComments,bodyclass','parameters');

mm_ddCreateSection('Параметры дочерних (наследуемые, пустое значение наследует родителя)', 'parameters_child','settings');
mm_ddMoveFieldsToSection('hideChilds,hideFolders,depth,ditto_display,ditto_orderBy,DisplayListStyle,intalias','parameters_child');

mm_ddCreateSection('Дополнительные тексты', 'addTexts','settings');
mm_ddMoveFieldsToSection('beforeContent,afterContent','addTexts');

mm_ddCreateSection('Отладка', 'debug','settings');
mm_ddMoveFieldsToSection('image_maket','debug');

if (! in_array(37,$pidAr) and $cid!=37 )  {
 mm_createTab('Изображения','photos');
 mm_moveFieldsToTab('image,photos','photos');
 mm_ddMultipleFields('photos', '', '', 'image,text', 'Изображение,Название');
}


if ($tpl == 8) { // Калькулятор
 mm_createTab('Калькулятор', 'calculator');
 mm_moveFieldsToTab('image,photos,calculator', 'calculator');
 mm_renameField('image', 'Превью');
 mm_changeFieldHelp('image', 'Изображение для выбора');
 mm_renameField('photos', 'Изображение');
 switch (true) {
  case ($cid == 37):
   mm_hideFields("image,photos");
   mm_renameField('calculator', 'Общие параметры');
   mm_changeFieldHelp('calculator', 'Стоимость монтажных работ: (Базовая: Sм&sup2; * Pруб., Периметр: Lм * Pруб. ');
   mm_ddMultipleFields('calculator', '', '', 'number,number,number,richtext', 'Базовая (руб./м&sup2;),Периметр для панели (руб.м),Шаг (мм),Предупреждение', "70,70,50,200", '||', '::', '', '', 0, 1);
   break;
  case ($cid == 38):  // Окна Формат : Ширина (мм.),Высота (мм.),КВЕ (руб.),Rehau (руб.),Комп-я панели (руб.),Комп-я кирпича (руб.)
   mm_renameField('calculator', 'Заголовки секции');
   mm_changeFieldHelp('calculator', "Названия данных расчета.  строка 1 - алиасы (служеб),  2 - Отображаемые названия, 3 - едницы измерения");
   mm_ddMultipleFields('calculator', '', '', 'textarea,textarea,textarea,textarea,textarea,textarea', 'Колонка 1,Колонка 2,Колонка 3,Колонка 4,Колонка 5,Колонка 6', '70%', '||', '::', '', '', 0, 4);
   break;
  case (in_array(38, $pidAr) and !$content["isfolder"]):
   $titles = $modx->runSnippet("getInheritField",array("id"=>$pid,"field"=>"calculator"));
   $titles = $modx->runSnippet("ddGetMultipleField",array("string"=>$titles,"outputFormat"=>"array"));
   $lt = count($titles);
   foreach ($titles[1] as $i => $v) $titles[$lt][$i] = $v." (".$titles[2][$i].")"; 
   mm_renameField('calculator', 'Параметры секции');
   mm_changeFieldHelp('calculator', '');
   mm_ddMultipleFields('calculator', '', '', 'number,number,number,number,number,number', implode(",",$titles[$lt]), '80%');
   break;
  case (in_array(39, $pidAr)  and !$content["isfolder"]):
   mm_renameField('calculator', 'Состав остекления');
   mm_changeFieldHelp('calculator', 'ID ресурсов с окнами через запятую или двойной клик в поле ввода для выбора из списка');
   mm_ddSelectDocuments('calculator', '', '', 38, 10, 'isfolder=0', 0, '[+title+] ([+id+])', true);
   break;
 }
}

mm_createTab('SEO: meta','seo_params');
mm_moveFieldsToTab('meta_title,meta_keywords,meta_description','seo_params');

if (in_array(8,$pidAr)) {
 mm_widget_evogallery(3,"Фотогалерея");
}
