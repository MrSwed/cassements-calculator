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
   "cols":[[ddGetMultipleField?
           &docField=`calculator`
           &docId=`39`
           &outputFormat=`JSON`
           ]],
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
    &docId=`[+id+]`
    &totalRows=`1`
    &outputFormat=`JSON`
   ]];
  $(function(){
   var _c = $(".form.calculator .workarea");
   _c.calculator({
     "data": CalcData, 
     "reference":{"price":{"montage":CalcData_add[0],"panel":CalcData_add[1]},"step":CalcData_add[2]},
     "texts":{"warning":CalcData_add[3]},
     "debug": 2
    });
   $(".parameters [type='button']",_c).click(function(){
     $(".modal").modal("open",{
      "afterOpen":function(){
       $("input:first",this).focus();
      }
     })
   });
   $('[name="price"]').on("change",function(){
    $(".price span").html(number_format($(this).val()));
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
     <label><input type="radio" name="system" value="Rehau" eform="Оконная система::1"/> Rehau</label>
     <label><input type="radio" name="system" value="KBE" eform="Оконная система::1"/> KBE</label>
    </div>
   </div>
   <div class="radio">
    <div>Комплектующие</div>
    <div><label><input type="radio" name="kit" eform="Комплектующие::1" value="для панельного дома"/> для панельного дома</label>
     <label><input type="radio" name="kit" eform="Комплектующие::1" value="для кирпичного дома"/> для кирпичного дома</label>
     <label><input type="radio" name="kit" eform="Комплектующие::1" value="не нужны"/> не нужны</label>
    </div>
   </div>
   <div class="radio">
    <div>Монтажные работы</div>
    <div>
     <label><input type="radio" name="montage" value="Да" eform="Монтажные работы::1"/> Да</label>
     <label><input type="radio" name="montage" value="Нет" eform="Монтажные работы::1"/> Нет</label>
    </div>
   </div>
   <div class="price"><span>00000</span> руб</div>
   <input type="button" value="Заказать"/>
  </div>
 </div>
 <div class="modal">
  <label for="email" class="">E-mail <span class="required-s">*</span>:<br/><input type="text" id="email" value="[+email+]" name="email" placeholder="email"  eform="email::0" /></label>
  <label for="name" class=" required">Ваше имя <span class="required-s">*</span>:<br/><input type="text" id="name" value="[+name+]" name="name" placeholder="Ваше имя" eform="Ваше имя::1"></label>
  <label for="phone" class="">телефон <span class="required-s">*</span>:<br/><input type="text" id="phone" value="[+phone+]" name="phone" placeholder="телефон"  eform="телефон::0" /></label>
  <label for="notes" class="">Вопрос<br/><textarea id="notes" name="notes" placeholder="Вопрос" cols="60" rows="5" eform="Вопрос::1">[+notes+]</textarea></label>
  <input type="submit" value="Отправить">
 </div>
</form>

</div>
