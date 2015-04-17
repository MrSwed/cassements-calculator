<?php
/**
 * calculator.php
 * @version 0.1 (2015-04-11)
 *
 * @desc A snippet for calculator data.
 * @note 
 *
 * @param $id {integer} - The resource id. Current is default
 *
 * @link 
 * 
 * @required 
 * - Snippet getInheritField
 * - Snippet ddGetMultipleField
 */

$id = (int)$id?(int)$id:$modx->documentObject['id']; 
$rootID = $id;

function calcRecursive($id,$debug=false) {
 global $modx,$rootID;
 $doc = $modx->getTemplateVarOutput(explode(",","alias,pagetitle,image,photos,calculator,isfolder"),$id);
 $outAr = array();
 $pidAr = array_reverse($modx->getParentIds($id)); 
 $pidAr = array_slice($pidAr,array_search($rootID,$pidAr));
 $deep = count($pidAr);
 $childs = array();
 $outNames = array(
  "alias"=>  $doc['alias'],
  "name"=>  $doc['pagetitle'],
 );
 if ($debug) $outNames["debug"] = "ID:$id, Deep:$deep";
 if ($doc['longtitle']) $outNames["title"] = $doc['longtitle'];
 foreach ($modx->getChildIds($id,1) as $alias => $chId) 
  $childs[$chId] = calcRecursive($chId,$debug);

 $outAr["datatype"] = $modx->runSnippet('getInheritField',array('id'=>$id, 'field'=>'calculator_type','rootID'=>$rootID));
 if ($deep == 0) {
  // Корень. различные общие настройки
  $outAr = array_merge($outNames, $outAr, array(
   "reference" => $modx->runSnippet("ddGetMultipleField",array( "docId" => $id, "docField" => 'calculator', "outputFormat" => 'array')),
   "data" => array_values($childs)
  ));

  // разбиваем справочник по структуре price[montage][kit][panel]
  $outArRef = array();
  if (is_array($outAr["reference"])) foreach ($outAr["reference"] as &$ref) {
   if (!empty($ref[0])) {
    if (FALSE !== ($levels = preg_split("/[\[\]]/", $ref[0], -1, PREG_SPLIT_NO_EMPTY))) {
     $pointer = &$outArRef;
     for ($i = 0; $i < sizeof($levels); $i++) {
      if (!isset($pointer[$levels[$i]])) $pointer[$levels[$i]] = array();
      $pointer =& $pointer[$levels[$i]];
     }
     $pointer = $ref[2];
    }
   }
  }
  $outAr["reference"] = &$outArRef;
  // заголовки, тексты
  $outAr["reference"]["captions"] = array();
  foreach ($modx->runSnippet("ddGetMultipleField",array( "docId" => $id, "docField" => 'image', "outputFormat" => 'array')) as $p) {
   $outAr["reference"]["captions"][$p[0]] = array("name"=>$p[1]);
  if (!empty($p[2])) $outAr["reference"]["captions"][$p[0]]["variants"] = $p[2];
  }
 } else if ($deep == 1) {                          // Первый уровень - группы (вкладки в пользовательском интерфейсе)
  $outAr = array_merge($outNames, $outAr);
  $getCols = $modx->runSnippet("ddGetMultipleField",array( "docId" => $id, "docField" => 'calculator', "outputFormat" => 'array')); 
  if ($getCols && is_array($getCols)) $outAr["cols"] = $getCols; 
  if ($childs) $outAr["data"] = $childs;
 } else if ($doc['isfolder']) {                    // Группировка по подкатегориям
  $outAr = array_merge($outNames,$outAr);
  $outAr["group"] =  $childs;
 } else {                                          // Конечный объект с данными
  $outAr = array_merge($outNames, $outAr, array(
   "preview" => $doc['image'],
   "image" => $doc['photos'],
   "data" => ($outAr["datatype"]=="multiple" ?
    $doc['calculator']:
    $modx->runSnippet("ddGetMultipleField",array("docId" => $id, "docField" => 'calculator', "outputFormat" => 'array')))
  ));
 }
 return $outAr;
}
$rAr = calcRecursive($id,1);
$result = json_encode($rAr,true);
return $result;
