<div class="form calculator loading">
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
   var m = $(".modal",_cp);   
   var _c = $(".workarea",_cp);
   _c.calculator({
    "dataUrl": "/ajax.php?id="+calcSourceID+"&source=snippet&name=calculator&formatIn=json",
    "price": $(".price span",_c),
    "report":{"tpl":"\
Конструкция:        <%name%>\n\
Оконная система:    <%system%>\n\
Комплектующие:      <%kit%>\n\
Монтаж:             <%montage%>\n\
Ширина:             <%width%>\n\
Высота:             <%height%>\n\
ID Секций:          <%id%>\n\
\n\
Рассчитанная цена:  <%price%> руб.\n\
\n\
Ссылка на расчет:   \n\
<%url%>"
      //,"out":$("[name='data']",m)
     }
//    ,"showUrl":false
//    ,"debug": 12
    }).on("inited",function(){
     $(this).css({"height":"auto"}).animate({"opacity":1},500);
     $(this).closest(".calculator").removeClass("loading");
    });
   $(".parameters #order",_c).click(function(){
     m.modal("open",{
      "afterOpen":function(){
       if (!$("form",m).size()) {
        $(".innerm",m).html("").append(_c.modalform);
       }
       $("input:first",this).focus();
       $("[name='data']").val(_c[0].report());
      }
     })
   });
   m.on("submit","form",function(e){
    e.preventDefault();
    var f = $(this);
    var fData = {};
    $.each(f.serializeObject(),function(k,v){
     if ($.inArray(k,"formid,email,id,notes,phone,price,veridata,name,data".split(","))!=-1) fData[k]=v;
    });
    _c.modalform =  f.detach();
    _c.modalform.find(".invalid").removeClass("invalid");
    $(".innerm",m).load(location.href+" .calculator .modal .innerm",fData);
   });
   if ($(".modal .message",_cp).text()) $(".parameters #order",_c).click();
  });
 </script>
 <div class="workarea" style="opacity:0">
  <div class="template" >
   <div class="type">
    <div class="caption">Выберите тип окна</div>
   </div>
  </div>
  <div class="preview"><a href="#"><img src="#" alt="" title=""/></a></div>
  <div class="parameters">
   <div class="price"><span>00000</span> руб</div>
   <input type="button" value="Заказать" id="order"/>
   <div class="warning">
     [!getInheritField? &id=`[!if? &is=`[*isfolder*]:=:1` &then=`[*id*]` &else=`[*parent*]` !]` &field=`photos`!]
    [[ в данном случае TV параметр photos используется для текста предупреждения ]]
   </div>
  </div>
 </div>
 <div class="modal">
  <div class="innerm">
   [!eForm?
   &formid=`calculatorForm`
   &tpl=`calculatorFormHtml`
   &report=`calculatorReport`
   &vericode=`0`
   &subject=`Заказ с сайта [(site_url)]`
   &from=`noreply@{{domain}}`
   &to=`test@web-grafica.info` &sendAsText=`1`
   &requiredClass=`invalid`
  !]
  </div> 
 </div>
</div>
