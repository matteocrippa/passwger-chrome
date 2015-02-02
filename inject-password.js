var pArr = [];
var pInputs = document.getElementByTagName("input");
for (var i=pInputs.length; i>0; i--){\
  if(pInputs[i].type.toLowerCase() === "password"){
    pInputs[i].value = passwgerUser;
    pInputs[i-1].value = passwgerPassw;
    return;
  }
}
