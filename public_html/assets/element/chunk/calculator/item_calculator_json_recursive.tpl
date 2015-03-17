[*phx:input=`[+isfolder+]`:is=`1`:then=`
   "[+id+]" =  [[Ditto?
 &parents=`[+id+]`
 &tpl=`item_calculator_json_recursive`
 &paginate=`0`
 &display=`all`
 &noResults=``
 ]], `:else=`
[+phx:input=`[+id+]`:parent=`id`:is=`39`:then=`      "[+id+]" : "[+calculator+]",
`:else=`
 [[ddGetMultipleField?
   &docField=`calculator`
   &docId=`[+id+]`
   &outputFormat=`JSON`
   ]]
 `+]
`*]