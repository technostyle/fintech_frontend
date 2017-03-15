var set1 = prompt("__2.2__ Input first set");
set1 = set1.split(' ');


var set2 = prompt("Input second set");
set2 = set2.split(' ');


var temp = [];
for (var i = 0; i < set1.length; i++)
	temp[set1[i]] = 1;

var ans = [];
for (var i = 0; i < set2.length; i++)
{
	if (temp[set2[i]] === 1)
		ans.push(set2[i]);
}

alert(ans);	
