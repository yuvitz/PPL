import { map, zipWith } from "ramda";
import { CExp, Parsed, PrimOp, AppExp, LitExp, isEmpty, makeStrExp, parseL3, IfExp, DefineExp, Program, Binding, LetExp, isStrExp, isString, makeNumExp, isNumber, makeBoolExp, isBoolean } from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp } from "./imp/L3-ast";
import { isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import { makeEmptySExp, isEmptySExp, isCompoundSExp, SExp, CompoundSExp, makeCompoundSExp, isClosure, makeClosure, makeSymbolSExp } from "./imp/L3-value";
import {first, second, rest} from './imp/list';
/*
Purpose: The procedure gets an L3 AST and returns L30 AST.
Signature: l3ToL30(exp)
Type: [Parsed | Error - > Parsed | Error]
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
   isLitExp(exp) ? handleLitExp(exp) : 
   exp;

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
   isEmptySExp(exp.val) ? exp :
   isCompoundSExp(exp.val) ? rewriteLitExp(exp.val) :
   exp;

export const rewriteLitExp = (exp: CompoundSExp): CExp =>
   makeAppExp(makePrimOp("cons"), [makeActualExp(exp.val1), handleLitExp(makeLitExp(exp.val2))]);

export const makeActualExp = (exp: SExp): CExp =>
   isNumber(exp.valueOf) ? makeNumExp(exp.valueOf) :
   isBoolean(exp.valueOf) ? makeBoolExp(exp.valueOf) :
   isString(exp.valueOf) ? makeStrExp(exp.valueOf) :
   makeLitExp(exp);
