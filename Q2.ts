import * as R from 'ramda'
import { NumericLiteral } from 'typescript';
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
export interface YMDDate {
    year: number;
    month: number;
    day: number;
}

export const comesBefore: (date1: YMDDate, date2: YMDDate) => boolean = (date1, date2) => {
    if (date1.year < date2.year) {
        return true;
    }
    if (date1.year === date2.year && date1.month < date2.month) {
        return true;
    }
    if (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day) {
        return true;
    }
    return false;
}

type PaymentMethod = Wallet | DebitCard | Cash;

export interface ChargeResult {
    amountLeft: number;
    wallet: Wallet;
}

interface Wallet {
    tag: "wallet";
    paymentMethods: PaymentMethod[];
}

interface DebitCard{
    tag: "debit card";
    expirationDate: YMDDate;
    amount: number;
}

interface Cash{
    tag: "cash";
    amount: number;
}
// predicates
const iSCash = (x: PaymentMethod): x is Cash => x.tag === "cash";
const isDebitCard = (x: PaymentMethod): x is DebitCard => x.tag === "debit card";
const isWallet = (x: PaymentMethod): x is Wallet => x.tag === "wallet";
// constructors
const makeCash = (amount: number): Cash =>
    ({tag: "cash", amount: amount});
const makeDebitCard = (amount: number, expirationDate: YMDDate): DebitCard =>
    ({tag: "debit card", expirationDate: expirationDate, amount: amount});
const makeWallet = (paymentMethods: PaymentMethod[]): Wallet =>
    ({tag: "wallet", paymentMethods: paymentMethods});
const makeChargeResult = (amountLeft: number, wallet: Wallet): ChargeResult =>
    ({amountLeft:amountLeft, wallet:wallet});
const addChRes = (old: ChargeResult, toAdd: ChargeResult): ChargeResult => 
    ({amountLeft: toAdd.amountLeft, wallet: makeWallet(old.wallet.paymentMethods.concat(toAdd.wallet.paymentMethods))})

export const charge = (pm: PaymentMethod, amount: number, today: YMDDate): ChargeResult =>
    iSCash(pm) ? (
        amount > pm.amount ? ( 
            makeChargeResult(amount - pm.amount, makeWallet([makeCash(0)]))) 
            : ( makeChargeResult(0, makeWallet([makeCash(pm.amount - amount)])))) 
            
    : isDebitCard(pm) ? (
        comesBefore(today, pm.expirationDate) ? (
            amount > pm.amount ? (
                makeChargeResult(amount - pm.amount, makeWallet([makeDebitCard(0, pm.expirationDate)]))) 
                : ( makeChargeResult(0, makeWallet([makeDebitCard(pm.amount - amount, pm.expirationDate)])))):
            // DebitCard is out of date
            makeChargeResult(amount, makeWallet([makeDebitCard(pm.amount, pm.expirationDate)])))

    : isWallet(pm) ? (
        pm.paymentMethods.reduce((acc: ChargeResult, curr:PaymentMethod) => 
            addChRes(acc, charge(curr, acc.amountLeft, today)), makeChargeResult(amount, makeWallet([]))))
    : null;

const wallet2 = makeWallet([
    makeCash(4500),
    makeDebitCard(3000, {year: 2010, month: 7, day: 31}), // note the expiration date
    makeDebitCard(300, {year: 2020, month: 7, day: 31})
    ]);

console.log(JSON.stringify(charge(wallet2, 7000, {year: 2019, month: 3, day: 7})));