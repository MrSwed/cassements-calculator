  <form action="" method="post" >
   <div class="message">[+validationmessage+]</div>
   <input type="hidden" name="formid" value="calculatorForm" />
   <label style="display:none"><input type="text" name="veridata" eform="&nbsp;:date:0::#REGEX /^$/" value=""/></label>
   <input type="hidden" name="id" value="" eform="::0::" />
   <input type="hidden" name="price" value="" eform="::0::"/>
   <label for="email" class="">E-mail <span class="required-s">*</span>:<br/><input type="text" id="email" value="[+email+]" name="email" placeholder="Ваш Email"  eform="Ваш Email:email:1" /></label>
   <label for="name" class=" required">Ваше имя <span class="required-s">*</span>:<br/><input type="text" id="name" value="[+name+]" name="name" placeholder="Ваше имя" eform="Ваше имя::1"></label>
   <label for="phone" class="">телефон <span class="required-s">*</span>:<br/><input type="text" id="phone" value="[+phone+]" name="phone" placeholder="телефон"  eform="телефон::1" /></label>
   <label for="notes" class="">Комментарии<br/><textarea id="notes" name="notes" placeholder="Вопрос" cols="60" rows="5" eform="Комментарии::0">[+notes+]</textarea></label>
   <label for="data" class="">Выбранный вариант<br/><textarea id="data" name="data" placeholder="" cols="60" rows="5" eform="::1">[+data+]</textarea></label>
   <input type="submit" value="Отправить">
  </form>
