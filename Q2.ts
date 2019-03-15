import * as R from 'ramda'
// Q2.1
export interface NumberTree {
    root: number;
    children: NumberTree[];
}

export const sumTreeIf:(node: NumberTree, pred: (x: number) => boolean) => number =
function (node:NumberTree, pred: (x: number) => boolean): number {
    let num: number = 0;
    if(pred(node.root))
        num = node.root;
    let sumOfChilds: number = node.children.reduce((acc, curr) => acc + sumTreeIf(curr, pred), 0);
    return num + sumOfChilds;
}
// Q2.2
export interface WordTree {
    root: string;
    children: WordTree[];
}

export const sentenceFromTree:(node: WordTree) => string =
function (node: WordTree): string {
    let restOfSentence: string = node.children.reduce((acc, curr) => acc.concat(sentenceFromTree(curr)), "");
    return node.root.concat(" ").concat(restOfSentence);
}

// Q2.3
export interface Grade {
    course: string;
    grade: number;
}

export interface Student {
    name: string;
    gender: string;
    grades: Grade[];
}

export interface SchoolClass {
    classNumber: number;
    students: Student[];
}
type School = SchoolClass[];

// Q2.3.1
export const hasSomeoneFailedBiology:(school: School) => boolean =
function (school: School): boolean {
    let students: Student[] = R.chain((classroom:SchoolClass) => classroom.students, school);
    let grades: Grade[] = R.chain((student: Student) => student.grades, students);
    let bioGrades: Grade[] = grades.filter((grade:Grade) => grade.course === "biology");
    return !bioGrades.reduce((acc, curr) => acc && (curr.grade >= 56), true);
}
//Q2.3.2
export const allGirlsPassMath:(school: School) => boolean =
function (school: School): boolean {
    let students: Student[] = R.chain((classroom:SchoolClass) => classroom.students, school);
    let girls: Student[] = students.filter((student:Student) => student.gender === "Female");
    let girlGrades: Grade[] = R.chain((student: Student) => student.grades, girls);
    let girlMathGrades: Grade[] = girlGrades.filter((grade:Grade) => grade.course === "math");
    return girlMathGrades.reduce((acc, curr) => acc && (curr.grade >= 56), true);
}


// Q2.4
// export interface YMDDate {
//     year: number;
//     month: number;
//     day: number;
// }

// export const comesBefore: (date1: YMDDate, date2: YMDDate) => boolean = (date1, date2) => {
//     if (date1.year < date2.year) {
//         return true;
//     }
//     if (date1.year === date2.year && date1.month < date2.month) {
//         return true;
//     }
//     if (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day) {
//         return true;
//     }
//     return false;
// }

// export interface ChargeResult {
//     amountLeft: number;
//     wallet: Wallet;
// }

// export const charge;