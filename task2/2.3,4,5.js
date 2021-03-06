//................... task 2.3 .........................
var doubleArr = [8, 4, [4, 6], 0, [1, 2, 3]];
var res = doubleArr.reduce(function (total, current) {
	return total.concat(current);
}, []); 

alert("__2.3__ \n double array : [8, 4, [4, 6], 0, [1, 2, 3]] \n single array : " + res);


//................... task 2.4 .........................
function bind(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
}

var user = {
  uname: "Вася",
  greet: function() {
    return this.uname + ' приветствует Вас!';
  }
};

var greet = bind(user.greet, user);
alert("__2.4__" + greet());


//................... task 2.5 .........................
var summer = {
	val : 0,
	sum : function(x) {
		if (x === undefined) {
			var ans = this.val;
			this.val = 0;
			return ans;
		}

		this.val += x;
		return this.sum.bind(this);
	}
};

var sum = summer.sum.bind(summer);
alert("__2.5__" +
			"\nsum() = " + sum() + 
			"\nsum(0)() = " + sum(0)() + 
			"\nsum(0)(1)() = " + sum(0)(1)() + 
			"\nsum(0)(0)() = " + sum(0)(0)() + 
			"\nsum(0)(1)(1)() = " + sum(0)(1)(1)() + 
			"\nsum(1)(2)() = " + sum(1)(2)() + 
			"\nsum(1)(2)(3)() = " + sum(1)(2)(3)()  + 
			"\nsum(1)(2)(-5)() = " + sum(1)(2)(-5)() +
			"\nsum(1)(0)(4)() = " + sum(1)(0)(4)() +
			"\nsum(0)(0)(-5)() = " + sum(0)(0)(-5)());
