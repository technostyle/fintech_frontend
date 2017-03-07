var j = -1;
for (var i = 0; i < 10; i++) {
   setTimeout(function(){
      j++;
      console.log(j);
   }, i * 1000);
}
