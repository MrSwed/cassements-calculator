<div class="form calculator">
<div class="message">[+validationmessage+]</div>
<form action="[~[*id*]~]?review=1" method="post" style="opacity:0;height:10em">
 <link rel="stylesheet" href="js/jquery-ui/jquery-ui.css" property="all"/>
 <script src="js/jquery-ui/jquery-ui.js"></script>
 <script type="text/javascript" src="/js/jquery.serialize-object.js"></script>
 <script type="text/javascript" src="/js/common.js"></script>
 <script type="text/javascript" src="/js/casement-calculator.js"></script>
 <script type="text/javascript" src="/js/jquery.unparam.min.js"></script>
 <link href="/design/casement-calculator.css" rel="stylesheet" type="text/css" property="all"/>
 
 <script type="text/javascript">
  var calcSourceID=37;
  $(function(){
   var _cp = $(".form.calculator").addClass("loading");
   var _c = $(".workarea",_cp);
   _c.calculator({
    "dataUrl": "/ajax.php?id="+calcSourceID+"&source=snippet&name=calculator&formatIn=json",
    "price": $(".workarea .price span"),
    "report":{"tpl":"\
Конструкция:      <%name%>\n\
url:              <%url%>\n\
Оконная система:  <%system%>\n\
Комплектующие:    <%kit%>\n\
Монтаж:           <%montage%>\n\
Ширина:           <%width%>\n\
Высота:           <%height%>\n\
ID Секций:        <%id%>\n\
\n\
Цена:             <%price%>руб.\n\
","out":$("[name='data']",_cp)
     }
//    ,"showUrl":false
//    ,"debug": 12
    }).on("inited",function(){
     $(this).closest("form").css({"height":"auto"}).animate({"opacity":1},500);
     $(this).closest(".calculator").removeClass("loading");
    });
   $(".parameters [type='button']",_c).click(function(){
     $(".modal",_cp).modal("open",{
      "afterOpen":function(){
       $("input:first",this).focus();
       _c[0].report();
      }
     })
   });
   $(".calculator form").submit(function(e){
    e.preventDefault();
    var f = $(this);
    var fData = {};
    $.each(f.serializeObject(),function(k,v){
     if ($.inArray(k,"formid,email,id,notes,phone,price,veridata,name,data".split(","))!=-1) fData[k]=v;
    });
    var m = $(".calculator .modal").wrapInner("<div class='innerm'/>");
    m.find(".close").remove();
    var cl = m.find(".innerm").detach(); 
    m.load(f.attr("action")+" .calcform ",fData,function(data){
     var mess = $(data).find(".message");
     if (mess.size()) return mess;
     m.modal();
     m.find(".close").click(function(){
      m.html("").append(cl).modal();
     })
    });
   });
  });
 </script>
 <input type="hidden" name="formid" value="calculatorForm" />
 <label style="display:none"><input type="text" name="veridata" eform="&nbsp;:date:0::#REGEX /^$/" value=""/></label>
 <div class="workarea">
  <input type="hidden" name="id" value="" eform="::0::" value=""/>
  <input type="hidden" name="price" value="" eform="::0::" value=""/>
  <div class="template" >
   <div class="type">
    <div class="caption">Выберите тип окна</div>
   </div>
  </div>
  <div class="preview"><a href="#"><img src="#" alt="" title=""/></a></div>
  <div class="parameters">
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
  <label for="data" class="">Выбранный вариант<br/><textarea id="data" name="data" placeholder="" cols="60" rows="5" eform="Комментарии::0">[+data+]</textarea></label>
  <input type="submit" value="Отправить">
 </div>
</form>

</div>
