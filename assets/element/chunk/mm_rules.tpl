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

// необходима версия ManagerManager  https://github.com/MrSwed/MODXEvo.plugin.ManagerManager 
if ($tpl == 8 && $cid) { // Калькулятор
 $calcID = 37;            // Указать ID корневого раздела, в котором данные калькулятора
 $cTVnames = array('i'=>'image','p'=>'photos','t'=>'calculator_type','c'=>'calculator');
 mm_createTab('Калькулятор', $cTVnames['c']);
 mm_moveFieldsToTab(implode(",",array_values($cTVnames)), $cTVnames['c']);
 $calcType = $modx->runSnippet('getInheritField',array("id"=>$cid?$cid:$pid,"field"=>$cTVnames['t']));
 mm_renameField($cTVnames['i'], 'Превью');
 mm_changeFieldHelp($cTVnames['i'], 'Изображение для выбора');
 mm_renameField($cTVnames['p'], 'Основное изображение');
 $ctParams = explode('||',$modx->db->getValue("SELECT elements FROM " . $modx->getFullTableName('site_tmplvars') . " WHERE name='".$cTVnames['t']."'"));
 foreach ($ctParams as $k=>$v) {
  $row = explode("==",$v,2);
  $ctParams[$row[1]] = $row[0]; 
 } 
 mm_renameField($cTVnames['t'], 'Тип данных');
 mm_changeFieldHelp($cTVnames['t'], 'Пусто - наследуеемое значение: <b class="tip" title="'.$calcType.'">"'.$ctParams[$calcType].'"</b>');
 if ($pid==0) { // Ресурс в корне - родительский для калькулятора - общие параметрые
  mm_renameField($cTVnames['i'], 'Заголовки параметров'); // вместо image
  mm_changeFieldHelp($cTVnames['i'], 'Укажите заголовки параметров. Определение привязки выбора определяется по пол. alias');
  mm_ddMultipleFields($cTVnames['i'], '', '', 'text,text,select', 'alias::Служебный идентификатор поля. Алиас,Название::Отображаемое название раздела,Варианты выбора::Да/Нет - если только два варианта', "90%", "||", "::", '', '', 0, 0, '||||[["","Зависит от данных"],["1","Да/Нет"]]');
  mm_renameField($cTVnames['p'], 'Текст предупреждения');
  mm_changeFieldHelp($cTVnames['p'], '');
  mm_ddMultipleFields($cTVnames['p'], '', '', 'richtext', '', "auto", '||', '::', '', '', 0, 1);
  mm_renameField($cTVnames['c'], 'Общие параметры ');
  mm_changeFieldHelp($cTVnames['c'], 'Стоимость монтажных работ: <br/>примеры исползуемых полей:<ul><li><b>price[montage][base]</b> -  Стоимость монтажных работ: (Базовая: S<sub>(м&sup2)</sub>; * P<sub>(руб.)</sub></li><li><b>price[montage][kit][panel]</b> -  Стоимость монтажа комплектующих для панельного дома: Периметр: L<sub>(м)</sub> * P<sub>(руб.)</sub> </li><li><b>price[montage][kit][kirpich]</b> -  Стоимость монтажа комплектующих для кирпичного дома: Периметр: L<sub>(м)</sub> * P<sub>(руб.)</sub> </li><li><b>step</b> -  Шаг выбора высоты и ширины, мм </li></ul>');
  mm_ddMultipleFields($cTVnames['c'], '', '', 'textarea,textarea,number,textarea', 'alias::Служебный идентификатор поля. Алиас,Название::Отображаемое название параметра,Значение,Формула расчета::В разработке', "90%");
 } else {
  if (!empty($content["isfolder"])) { 
  // для дочерих разделов поля изображений не используются 
   mm_hideFields($cTVnames['i'] . ",". $cTVnames['p']);
   if ($pid==$calcID) {
    //настройки колонок - количество в строках
    mm_renameField($cTVnames['c'], 'Колонки параметров секции (Параметры для расчета)');
    mm_changeFieldHelp($cTVnames['c'], "1 - алиасы (служеб. идентификаторы),  2 - Отображаемое название, 3 - единицы измерения");
    mm_ddMultipleFields($cTVnames['c'], '', '', 'text,text,text,text', 'alias::Служебный идентификатор поля. Алиас,Название::Отображаемое название колонок,Ед.Изм.::Единицы измерения,Привязка::Привязка к выбору параметра тип#имя', '90%');
   } else mm_hideFields($cTVnames['c']);
  }
  if ($calcType == "section") { // Параметры секций 
   if (empty($content["isfolder"])) { // 
    $titles = $modx->runSnippet("getInheritField", array("id" => $pid, "field" => $cTVnames['c']));
    $titles = $modx->runSnippet("ddGetMultipleField", array("string" => $titles, "outputFormat" => "array"));
    $lt = count($titles);
    if ($lt > 2 and is_array($titles[0]) and count($titles[0]) >= 3) { // в заголовках должно быть минимум 3 параметра (см выше)
     foreach ((array)$titles as $i => $v) $titles[$lt][$i] = $v[1] . " (" . $v[2] . ")";
     mm_renameField($cTVnames['c'], 'Параметры секции');
     mm_changeFieldHelp($cTVnames['c'], '');
     mm_ddMultipleFields($cTVnames['c'], '', '', implode(",", array_fill(0, $lt, "number")), implode(",", $titles[$lt]), '80%');
    } else {
     mm_ddCreateSection('Параметры колонок родительского разделы заданы не верно', 'ErrorMessage', $cTVnames['c']);
     mm_ddReadonly($cTVnames['c']);
     mm_ddMoveFieldsToSection($cTVnames['c'], 'ErrorMessage');
    }
   }
  } else if ($calcType == "multiple") { // Параметры составных блоков
   if (empty($content["isfolder"])) {
    mm_renameField($cTVnames['c'], 'Состав остекления');
    mm_changeFieldHelp($cTVnames['c'], 'ID ресурсов с окнами через запятую или двойной клик в поле ввода для выбора из списка');
    mm_ddSelectDocuments($cTVnames['c'], '', '', $calcID, 10, 'isfolder=0', 0, '[+title+] ([+id+])', true);
   } else {
    mm_hideFields(implode(",", array_filter($cTVnames, function ($item) {
     return !in_array($item, (explode(",",'calculator,calculator_type')));
    })));
   }
  }  
 }
}
