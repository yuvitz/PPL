import { map } from "ramda";
import { Parsed, AppExp, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isLitExp, isProcExp, isIfExp, isAppExp, isDefineExp, isLetExp, PrimOp, CExp, first, parseL3 } from './imp/L3-ast';
import {parsedToString} from './imp/L3-value';
import {isError} from './imp/error';

/*
Purpose: The procedure gets an L2 AST and returns a string of the equivalent Python program.
Signature: l2ToPython(exp)
Type: [Parsed | Error -> string | Error]
*/
export const l2ToPython = (exp: Parsed | Error): string | Error => 
   isError(exp) ? exp.message :
   isProgram(exp) ? map(l2ToPython,exp.exps).join("\n") :
   isBoolExp(exp) ? (exp.val ? 'True' : 'False') :
   isNumExp(exp) ? exp.val.toString() :
   isVarRef(exp) ? exp.var :
   isPrimOp(exp) ? exp.op :
   isDefineExp(exp) ?  exp.var.var + " = " + l2ToPython(exp.val) :
   isProcExp(exp) ? "(" + "lambda " +
      map((p) => p.var, exp.args).join(", ") + ": " +
      map(l2ToPython, exp.body).join(" ") +
      ")" :
   isIfExp(exp) ? "(" + l2ToPython(exp.then) +" if " +
      l2ToPython(exp.test) + " else " +
      l2ToPython(exp.alt) +
      ")" :
   isAppExp(exp) ? handleAppExp(exp) :
   Error("Unknown expression: " + exp.tag);

export const handleAppExp = (exp: AppExp): string | Error =>
   isPrimOp(exp.rator) ? (exp.rator.op === "not") ? "(not " + l2ToPython(first(exp.rands)) + ")" :
   "(" + map(l2ToPython, exp.rands).join(" " + l2ToPython(exp.rator) + " ") + ")" :
   isProcExp(exp.rator) ? l2ToPython(exp.rator) + "(" + map(l2ToPython, exp.rands).join(",") + ")":
   isVarRef(exp.rator) ? l2ToPython(exp.rator) + "(" + map(l2ToPython, exp.rands).join(",") + ")":
   Error("bad");