[*phx:input=`[+isfolder+]`:is=`1`:then=`//
   "[+id+]":  {
    "title": "[+pagetitle+]",
    "group": { [[Ditto?
               &parents=`[+id+]`
               &tpl=`item_calculator_json_recursive`
               &tplLast=`item_calculator_json_recursive_last`
               &paginate=`0`
               &orderBy=`menuindex asc`
               &display=`all`
               &noResults=``
               ]] }
    }`:else=`
     "[+id+]": {
      "title":"[+pagetitle+]",
      "preview":"[+image+]",
      "image":"[+photos+]",
      "data":[+phx:input=`[+id+]`:parent=`id`:is=`39`:then=`"[+calculator+]"`:else=` [[ddGetMultipleField?
              &docField=`calculator`
              &docId=`[+id+]`
              &outputFormat=`JSON`
             ]] `+]
     }`*]