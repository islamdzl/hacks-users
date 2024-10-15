
        document.getElementById('div').innerHTML=`
        <div class="uesr"><h1>LODING</h1><div class="it">لا يوجد بينات</div></div>
      
      `

      document.getElementById('div').innerHTML+=`
      <div class="uesr">
      <div class="yiu">
      <h1>|Location : ${tat[z].Location}</h1>
      <h1>|ID : ${tat[z].ID}</h1>
      <h1>|BANE : ${tat[z].BANE}</h1>
      <h1>|LOG : ${tat[z].IA}</h1>
      </div>
      <div class="rus"><h2>EMAIL : ${tat[z].Email}</h2></div>
      <div class="rus"><h2>PASSWORD : ${tat[z].Password}</h2></div>
      <div class="btts">
      <input type="button" class="${tat[z].BANE}" id="B${tat[z].ID}" onclick="RST(this.id)" value="BANE">
      <input type="button" class="${tat[z].IA}" id="L${tat[z].ID}" onclick="RST(this.id)" value="LOG">
      <input type="button" class="true" id="D${tat[z].ID}" onclick="RST(this.id)" value="CLEAR">
      <h1 class="c${cTF}">${afer}</h1>
      <div class="i${ldtf}"></div>
      </div>
      </div> 
      
      `

