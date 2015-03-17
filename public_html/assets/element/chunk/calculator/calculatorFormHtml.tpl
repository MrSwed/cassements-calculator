<div class="form calculator">
<div class="message">[+validationmessage+]</div>
<form action="[~[*id*]~]?review=1" method="post">
 <input type="hidden" name="formid" value="calculatorForm" />
 <label style="display:none"><input type="text" name="veridata" eform="&nbsp;:date:0::#REGEX /^$/" value=""/></label>
 <script type="text/javascript">
  var CalcData = {{ditto_calculator_json_recursive}};
 </script>
 <div class="tabs">
  <div class="headers"><a href="[~[*id*]~]#windows">пластиковые окна</a><a href="[~[*id*]~]#gallery">остекление балконов</a></div>
  <div class="contents">
   <div class="text">
    <div class="sizes">
     <img src="#" alt=""/>
     <label class="height"><input type="text" name="height"/></label>
     <label class="width"><input type="text" name="width"/></label>
    </div>
    <div class="parameters">
     <div class="type">тут картинки типов остеклений</div>
     <div class="radio"><span>Оконная система</span>
      <label><input type="radio" name="system" value="Rehau"/> Rehau</label>
      <label><input type="radio" name="system" value="KBE"/> KBE</label>
     </div>
     <div class="radio"><span>Комплектующие</span>
      <label><input type="radio" name="kit" value="для панельного дома"/> для панельного дома</label>
      <label><input type="radio" name="kit" value="для кирпичного дома"/> для кирпичного дома</label>
      <label><input type="radio" name="kit" value="не нужны"/> не нужны</label>
     </div>
     <div class="radio"><span>Монтажные работы</span>
      <label><input type="radio" name="montage" value="Да"/> Да</label>
      <label><input type="radio" name="montage" value="Нет"/> Нет</label>
     </div>
     <div class="price"><span>00000</span> руб</div>
     <input type="button" value="Заказать"/> 
    </div>
   </div>
   <div class="text"></div>
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
