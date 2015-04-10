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
      "data":[+phx:input=`[[getInheritField? &id=`[+id+]` &field=`calculator_type`]]`:is=`multiple`:then=`"[+calculator+]"`:else=` [[ddGetMultipleField?
              &docField=`calculator`
              &docId=`[+id+]`
              &outputFormat=`JSON`
             ]] `+]
     }`*],