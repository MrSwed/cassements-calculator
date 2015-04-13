<div class="form calculator">
<div class="message">[+validationmessage+]</div>
<form action="[~[*id*]~]?review=1" method="post">
 <link rel="stylesheet" href="js/jquery-ui/jquery-ui.css" property="all"/>
 <script src="js/jquery-ui/jquery-ui.js"></script>
 <script type="text/javascript" src="/js/jquery.serialize-object.js"></script>
 <script type="text/javascript" src="/js/common.js"></script>
 <script type="text/javascript" src="/js/casement-calculator.js"></script>
 <link href="/design/casement-calculator.css" rel="stylesheet" type="text/css" property="all"/>
 
 <script type="text/javascript">
  var CalcTest = [] ;
  var jqxhr = $.getJSON( "/ajax.php", {"id":"37", "source":"snippet", "name":"calculator","formatIn":"json"},function(data) {
   console.log(data);
//   $.each( data.items, function( i, item ) {
//    $( "<img>" ).attr( "src", item.media.m ).appendTo( "#images" );
//    if ( i === 3 ) {
//     return false;
//    }
//   });
   CalcTest = data;
   console.log( "success" );
  })
   .done(function(data) {
    console.log( "second success" );
   })
   .fail(function() {
    console.log( "error" );
   })
   .always(function() {
    console.log( "complete" );
   });

  // Perform other work here ...

  // Set another completion function for the request above
  jqxhr.complete(function() {
   console.log( "second complete" );
  });
  console.log(jqxhr);
  
 var CalcData = [
  {"alias":"#windows", 
   "name":"пластиковые окна",
   "cols":[[ddGetMultipleField?
           &docField=`calculator`
          &docId=`38`
          &outputFormat=`JSON`
          ]],
   "data": {[!Ditto?
    &parents=`38`
    &tpl=`item_calculator_json_recursive`
    &tplLast=`item_calculator_json_recursive_last`
    &paginate=`0`
    &display=`all`
    &orderBy=`menuindex asc`
    &noResults=``
    !]
   }
  },
  {"alias":"#balcony",
   "name":"остекление балконов",
   "data": {[!Ditto?
    &parents=`39`
    &tpl=`item_calculator_json_recursive`
    &tplLast=`item_calculator_json_recursive_last`
    &paginate=`0`
    &display=`all`
    &orderBy=`menuindex asc`
    &noResults=``
   !]
   }
  }
 ];
  var CalcData_add = [[ddGetMultipleField?
    &docField=`calculator`
    &docId=`37`
    &totalRows=`1`
    &outputFormat=`JSON`
   ]];
  $(function(){
   var _c = $(".form.calculator .workarea");
   _c.calculator({
    "data": CalcData,
    "reference": {
     "price": {
      "montage": {
       "base": CalcData_add[0],
       "kit": {
        "panel": CalcData_add[1],
        "kirpich": CalcData_add[2]
       }
      }
     }, "step": CalcData_add[3]
    },
    "price": $(".workarea .price span"),
    "debug": 2
    });
   $(".parameters [type='button']",_c).click(function(){
     $(".modal").modal("open",{
      "afterOpen":function(){
       $("input:first",this).focus();
      }
     })
   });
  });
 </script>
 <input type="hidden" name="formid" value="calculatorForm" />
 <label style="display:none"><input type="text" name="veridata" eform="&nbsp;:date:0::#REGEX /^$/" value=""/></label>
 <div class="workarea">
  <input type="hidden" name="id" value="" eform="Ошибка получения идентификатора:integer:1" value=""/>
  <input type="hidden" name="price" value="" eform="Ошибка расчета стоимости:float:1" value=""/>
  <div class="template" >
   <div class="type">
    <div class="caption">Выберите тип окна</div>

   </div>
  </div>
  <div class="preview"><a href="#"><img src="#" alt="" title=""/></a></div>
   <div class="sizes">
    <label class="height"><span>Высота, мм</span> <input type="text" name="height" eform="Высота::1" /></label>
    <label class="width"><span>Ширина, мм</span> <input type="text" name="width" eform="Ширина::1" /></label>
   </div>
  <div class="parameters">
   <div class="radio">
    <div>Оконная система</div>
    <div>
     <label><input type="radio" name="system" value="rehau" eform="Оконная система::1"/> Rehau</label>
     <label><input type="radio" name="system" value="kbe" eform="Оконная система::1"/> KBE</label>
    </div>
   </div>
   <div class="radio">
    <div>Комплектующие</div>
    <div><label><input type="radio" name="kit" eform="Комплектующие::1" value="panel"/> для панельного дома</label>
     <label><input type="radio" name="kit" eform="Комплектующие::1" value="kirpich"/> для кирпичного дома</label>
     <label><input type="radio" name="kit" eform="Комплектующие::1" value="none"/> не нужны</label>
    </div>
   </div>
   <div class="radio">
    <div>Монтажные работы</div>
    <div>
     <label><input type="radio" name="montage" value="1" eform="Монтажные работы::1"/> Да</label>
     <label><input type="radio" name="montage" value="0" eform="Монтажные работы::1"/> Нет</label>
    </div>
   </div>
   <div class="price"><span>00000</span> руб</div>
   <input type="button" value="Заказать"/>
   <div class="warning">
     [[getInheritField? &id=`[!if? &is=`[*isfolder*]:=:1` &then=`[*id*]` &else=`[*parent*]` !]` &field=`photos`]]
    [[ в данном случае TV параметр photos используется для текста предупреждения ]]
   </div>
  </div>
 </div>
 <div class="modal">
  <label for="email" class="">E-mail <span class="required-s">*</span>:<br/><input type="text" id="email" value="[+email+]" name="email" placeholder="email"  eform="email::1" /></label>
  <label for="name" class=" required">Ваше имя <span class="required-s">*</span>:<br/><input type="text" id="name" value="[+name+]" name="name" placeholder="Ваше имя" eform="Ваше имя::1"></label>
  <label for="phone" class="">телефон <span class="required-s">*</span>:<br/><input type="text" id="phone" value="[+phone+]" name="phone" placeholder="телефон"  eform="телефон::1" /></label>
  <label for="notes" class="">Комментарии<br/><textarea id="notes" name="notes" placeholder="Вопрос" cols="60" rows="5" eform="Комментарии::0">[+notes+]</textarea></label>
  <input type="submit" value="Отправить">
 </div>
</form>

</div>
