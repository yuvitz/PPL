interface employee{
	name: string;
	salary: number;
}
const averageSalaryOver9000:(employees: employee[]) => number =
function(employees: employee[]): number {
	let over9000: employee[] = employees.filter(x => x.salary > 9000);
	let salarySum: number = over9000.reduce((acc: number, cur: employee) => acc + cur.salary, 0);
	return salarySum / over9000.length;
}

let employees: employee[] = [{name: "Moshe", salary: 5600}, {name: "Dorit", salary: 7600},
{name: "Naama", salary: 10000},{name: "Dani", salary: 9600}];
console.log(averageSalaryOver9000(employees));