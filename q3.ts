import { map, zipWith } from "ramda";
import { CExp, Parsed, PrimOp, AppExp, LitExp, isEmpty, makeStrExp, parseL3, IfExp, DefineExp, Program, Binding, LetExp } from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import { makeEmptySExp, isEmptySExp, isCompoundSExp } from "./imp/L3-value";
import {first, second, rest} from './imp/list';
import { unparseL3 } from "./imp/L3-unparse";
/*
Purpose: @TODO
Signature: @TODO
Type: @TODO
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
   isProgram(exp) ? handleProgram(exp) :
   isDefineExp(exp) ? handleDefineExp(exp) :
   isCExp(exp) ? handleCExp(exp) :
   exp;
   
export const handleProgram = (exp: Program): Program =>
   map(l3ToL30, exp.exps);

export const handleDefineExp = (exp: DefineExp): Parsed | Error =>
   isAppExp(exp.val) ? makeDefineExp(exp.var, handleAppExp(exp.val)) :
   isLitExp(exp.val) ? makeDefineExp(exp.var, handleLitExp(exp.val)) :
   exp;

export const handleCExp = (exp: CExp): CExp =>
   isAtomicExp(exp) ? exp :
   isAppExp(exp) ? handleAppExp(exp) :
   isIfExp(exp) ? 
      makeIfExp(handleCExp(exp.test), handleCExp(exp.then), handleCExp(exp.alt)) :
   isProcExp(exp) ?
      makeProcExp(exp.args, map(l3ToL30, exp.body)) :
   isLetExp(exp) ?
      makeLetExp(map(handleBinding, exp.bindings), map(l3ToL30, exp.body)) :
   isLitExp(exp) ? rewriteLitExp(exp) : exp;

export const handleAppExp = (exp: AppExp): CExp => 
   isPrimOp(exp.rator) && exp.rator.op === "list" ?  
   isEmpty(exp.rands) ? makeLitExp(makeEmptySExp()) :
   makeAppExp(makePrimOp("cons"),[handleCExp(first(exp.rands)), rewriteAppExp(rest(exp.rands))]) :
   makeAppExp(handleCExp(exp.rator), map(handleCExp, exp.rands));

export const handleBinding = (bind: Binding): Binding =>
   makeBinding(bind.var.var, handleCExp(bind.val));

export const rewriteAppExp = (exp: CExp[]): CExp =>
   isEmpty(exp) ? makeLitExp(makeEmptySExp()) :
   makeAppExp(makePrimOp("cons"), [handleCExp(first(exp)), rewriteAppExp(rest(exp))]);

export const handleLitExp = (exp: LitExp): CExp =>
   exp;
   
export const rewriteLitExp = (exp: LitExp): CExp =>
   exp;

   console.log(unparseL3(l3ToL30(parseL3(`(let ((x '()) (y (list 3 4))) (list x y))`))));