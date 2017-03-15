var input;
input = prompt("__2.1__ input positive integer");

function makeBinary(n) {
	
	if (n <= 0)
		return "";

	var remainder = n % 2;
	var binary = makeBinary((n - remainder) / 2) + remainder;

	return binary;
}

alert(makeBinary(input));
