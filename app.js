var first = prompt("enter first string");
var second = prompt("enter second string");


function is_anagram(first, second){

	var first_length = first.length;
	if (first_length != second.length)
		return false;

	var str = second;
	var cur, index;
	for (var i = 0; i < first_length; i++)
	{
		cur = first.charAt(i);
		index = str.indexOf(cur);
		if (index == -1)
			return false;
		str = str.substring(0, index) + str.substring(index + 1);
	}

	return true;
}

alert(is_anagram(first, second));
