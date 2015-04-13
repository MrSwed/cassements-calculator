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


function calcRecursive($id) {
 global $modx;
 $doc = $modx->getTemplateVarOutput(explode(",","alias,pagetitle,image,photos,calculator,isfolder"),$id);
 $outAr = array();
//return json_encode($doc);

 $pidAr = $modx->getParentIds($id);
 $docLevel = count($pidAr);
 $childs = array();
 $outNames = array(
  "alias"=>  $doc['alias'],
  "name"=>  $doc['pagetitle'],
  "debug" => "$id: $docLevel",
 );
 foreach ($modx->getChildIds($id,1) as $alias => $chId) 
  $childs[$chId] = calcRecursive($chId);
 
// echo "<pre> $id: $docLevel childs:"; print_r($childs);echo "</pre>";

 if ($docLevel == 0) {
  return array_values($childs);
 } else if ($docLevel == 1) {
  $outAr = array_merge($outNames, array(
   "doclevel"=>  $docLevel,
  ));
  $getCols = $modx->runSnippet("ddGetMultipleField",array( "docId" => $id, "docField" => 'calculator', "outputFormat" => 'array')); 
//  echo "<pre> $id: $docLevel \$outAr:"; print_r($outAr);echo "\$getCols (".gettype($getCols).")".var_export($getCols,1)."</pre>";
  if ($getCols && is_array($getCols)) $outAr["cols"] = $getCols ; 
  if ($childs) $outAr["data"] = $childs;
 } else if ($doc['isfolder']) {
  $outAr = $outNames;
  $outAr["group"] =  $childs;
 } else {
  $outAr["calculator_type"] = (array)$modx->runSnippet('getInheritField',array('id'=>$id, 'field'=>'calculator_type'));
  $outAr = array_merge($outNames, array(
   "preview" => $doc['image'],
   "image" => $doc['photos'],
   "data" => ($outAr["calculator_type"]=="multiple" ?
    $doc['calculator']:
    $modx->runSnippet("ddGetMultipleField",array("docId" => $id, "docField" => 'calculator', "outputFormat" => 'array')))
  ));
 }
 return $outAr;
}
$rAr = calcRecursive($id);
$result = json_encode($rAr,true);

//echo "<pre>";
//print_r($rAr);
//echo $result;
//exit;

//echo "<pre> $id: $docLevel Last error: ".json_last_error()."</pre>";

return $result;
//return var_export(calcRecursive($id),1);