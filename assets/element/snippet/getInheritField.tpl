<?php
/**
 * getInheritField
 *
 * Получить значение наследуемого параметра
 *
 * @category 	snippet
 * @version 	1.2
 * @license 	http://www.gnu.org/copyleft/gpl.html GNU Public License (GPL)
 * @internal	@properties
 * @internal	@modx_category Utils
 * @internal	@installset base, sample
 */

// Получает значение родительского параметра, если значение не указано (или равно заданному в &toparent)

$id     = isset($id)?$id:$modx->documentObject['id'];
$field  = isset($field)?$field:"";
$default = isset($default)?$default:""; // если не нашли значение до самого верха
$toparent = isset($toparent)?$toparent:""; // использовать другой флаг получения значения родителя
$deep = isset($deep)?$deep:100;
$out = isset($out)?$out:"%s";
$outEmpty = isset($outEmpty)?$outEmpty:"%s";
$rootID = isset($rootID)?$rootID:0; // ID коневого (верхнего) раздела, для которого значение уже не найдено

$value = $toparent;
$cid = $id;
while ( $value == $toparent and (int)$cid!=$rootID and --$deep > 0) {
 $value = $modx->getTemplateVarOutput(array($field,"parent"), $cid, 1);
 $cid = $value["parent"];
 $value = $value[$field];
}
if ($value == $toparent) $value = $default;
return $value?
 ($out?sprintf($out,$value):""):
 ($outEmpty?sprintf($outEmpty,$value):"");
