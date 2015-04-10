<?
// more example rules are in assets/plugins/managermanager/example_mm_rules.inc.php

// example of how PHP is allowed - check that a TV named documentTags exists before creating rule
if($modx->db->getValue("SELECT COUNT(id) FROM " . $modx->getFullTableName('site_tmplvars') . " WHERE name='documentTags'")) {
    mm_widget_tags('documentTags',' '); // Give blog tag editing capabilities to the 'documentTags (3)' TV
}

mm_widget_showimagetvs(); // Always give a preview of Image TVs

/* Переменные для использования */
$cid = isset($content['id'])?$content['id']:false;
$pid = !empty($content['parent'])?$content['parent']:$_GET["pid"];
$tpl = $content['template'];
$pidAr = array_merge(array($pid),$modx->getParentIds($pid)); // роительский путь
/**/


mm_ddMultipleFields('shop_models', '', '6', 'text,text', 'Модель,Цена','','||','==');
mm_ddMultipleFields('shop_parameters', '', '6', 'text,text', 'Название,Значение');
mm_createTab('Магазин','shop','','6');
mm_moveFieldsToTab('price,shop_models,shop_parameters','shop');

mm_ddCreateSection('Параметры (наследуемые, пустое значение наследует родителя)', 'parameters','settings');
mm_ddMoveFieldsToSection('hidePageTitle,hideBreadcrumbs,showParentTitle,showDateInContent,hideRightCol,enableShare,enableComments,bodyclass','parameters');

mm_ddCreateSection('Параметры дочерних (наследуемые, пустое значение наследует родителя)', 'parameters_child','settings');
mm_ddMoveFieldsToSection('hideChilds,hideFolders,depth,ditto_display,ditto_orderBy,DisplayListStyle,intalias','parameters_child');

mm_ddCreateSection('Дополнительные тексты', 'addTexts','settings');
mm_ddMoveFieldsToSection('beforeContent,inheritBeforeContent,afterContent,inheritAfterContent','addTexts');

mm_ddCreateSection('Отладка', 'debug','settings');
mm_ddMoveFieldsToSection('image_maket','debug');

if ($tpl != 8 )  {
 mm_createTab('Изображения','photos');
 mm_moveFieldsToTab('image,photos','photos');
 mm_ddMultipleFields('photos', '', '', 'image,text', 'Изображение,Название');
}


if ($tpl == 8) { // Калькулятор
 mm_createTab('Калькулятор', 'calculator');
 mm_moveFieldsToTab('image,photos,calculator_type,calculator', 'calculator');
 $calcType = $modx->runSnippet("getInheritField",array("id"=>$cid?$cid:$pid,"field"=>"calculator_type"));
 mm_renameField('image', 'Превью');
 mm_changeFieldHelp('image', 'Изображение для выбора');
 mm_renameField('photos', 'Изображение');
 if ($pid==0) { // Ресурс в корне - родительский для калькулятора - общие параметрые
  mm_hideFields("image");
  mm_renameField('photos', 'Текст предупреждения');
  mm_changeFieldHelp('photos', '');
  mm_ddMultipleFields('photos', '', '', 'richtext', '', "auto", '||', '::', '', '', 0, 1);
  mm_renameField('calculator', 'Общие параметры');
  mm_changeFieldHelp('calculator', 'Стоимость монтажных работ: (Базовая: Sм&sup2; * Pруб., Стоимость монтажа комплектующих: Периметр: Lм * Pруб. ');
  mm_ddMultipleFields('calculator', '', '', 'number,number,number,number', 'Базовая (руб./м&sup2;),Монтаж панель (руб.м),Монтаж кирпич (руб.м),Шаг (мм)', "70,70,70,50", '||', '::', '', '', 0, 1);
 } else 
 if ($calcType=="section") { // Параметры секций 
  if (!empty($content["isfolder"])) {
   mm_renameField('calculator', 'Колонки параметров секции');
   mm_changeFieldHelp('calculator', "1 - алиасы (служеб. идентификаторы),  2 - Отображаемое название, 3 - единицы измерения");
   mm_ddMultipleFields('calculator', '', '', 'textarea,textarea,textarea,textarea', 'alias::Служебные идентификаторы полей. Алиасы,Название::Отображаемое название колонок,Ед.Изм.::Единицы измерения', '70%');
  } else {
   $titles = $modx->runSnippet("getInheritField",array("id"=>$pid,"field"=>"calculator"));
   $titles = $modx->runSnippet("ddGetMultipleField",array("string"=>$titles,"outputFormat"=>"array"));
   $lt = count($titles);
   if ($lt > 2 and is_array($titles[0]) and count($titles[0])>=3) { // в заголовках должно быть минимум 3 параметра (см выше)
    foreach ((array) $titles as $i => $v) $titles[$lt][$i] = $v[1] . " (" . $v[2] . ")";
    mm_renameField('calculator', 'Параметры секции');
    mm_changeFieldHelp('calculator', '');
    mm_ddMultipleFields('calculator', '', '', implode(",", array_fill(0, $lt, "number")), implode(",", $titles[$lt]), '80%');
   } else {
    mm_ddCreateSection('Параметры колонок родительского разделы заданы не верно', 'ErrorMessage','calculator');
    mm_ddReadonly('calculator');
    mm_ddMoveFieldsToSection('calculator','ErrorMessage');
   }
  }
 } else 
  if ($calcType=="multiple") { // Параметры составных блоков
   if (empty($content["isfolder"])) {
    mm_renameField('calculator', 'Состав остекления');
    mm_changeFieldHelp('calculator', 'ID ресурсов с окнами через запятую или двойной клик в поле ввода для выбора из списка');
    mm_ddSelectDocuments('calculator', '', '', 38, 10, 'isfolder=0', 0, '[+title+] ([+id+])', true);
   }
  }
}

mm_createTab('SEO: meta','seo_params');
mm_moveFieldsToTab('meta_title,meta_keywords,meta_description','seo_params');

if (in_array(8,$pidAr)) {
 mm_widget_evogallery(3,"Фотогалерея");
}
