function c(){[...document.querySelectorAll('input[type="checkbox"]')].forEach(e=>{localStorage.getItem(e.id)==="true"&&(e.checked=!0),e.addEventListener("change",r=>{const t=r.target;localStorage.setItem(t.id,t.checked.toString())})})}export{c as r};