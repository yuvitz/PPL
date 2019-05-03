import { Graph } from "graphlib";
import dot = require("graphlib-dot");
import { length, map, range, zipWith } from "ramda";
import {
    AtomicExp, Exp, IfExp, Parsed, VarDecl, isAtomicExp, DefineExp, AppExp, ProcExp,
    isAppExp, isDefineExp, isExp, isIfExp, isProcExp, parse, unparse, isProgram, isCExp, isLitExp } from "./L4-ast";
import { safeF2, safeFL, safeF } from "./error";
import { isArray } from "./list";

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

interface Tree {
    tag: "Tree",
    rootId: string,
    graph: Graph, 
}

export const isTree = (x: any): x is Tree => x.tag === "Tree";

const makeLeaf = (label: string): Tree => {
    let graph = new Graph();
    const headId = generateId();
    graph.setNode(headId, { label, shape: "record" });
    return { tag: "Tree", rootId: headId, graph };
}


const makeTree = (label: string, nodes: Tree[], edgesLabels: string[]): Tree => {
    let graph = new Graph();
    const headId = generateId();
    graph.setNode(headId, { label, shape: "record" });
    zipWith(
        (t, edgeLabel) => {
            map(n => graph.setNode(n, t.graph.node(n)), t.graph.nodes());
            map(e => graph.setEdge(e.v, e.w, t.graph.edge(e)), t.graph.edges());
            graph.setEdge(headId, t.rootId, {label: edgeLabel});
        },
        nodes,
        edgesLabels
    )
    return { tag: "Tree", rootId: headId, graph };
}

const astToDot = (ast: Tree): string => dot.write(ast.graph);

const expToTree = (exp: string) =>
    safeF(astToDot)(safeF(makeAST)(parse(exp)));

export const makeAST = (exp: Parsed): Tree | Error =>
    isProgram(exp) ? makeTree("Program", [makeTree(":", map(e => makeAST(e), exp.exps), makeEdgeLabes(exp.exps))], ["exps"]) :
    isDefineExp(exp) ? makeDefineExpTree(exp) :
    isCExp(exp) ? (isArray(exp) ? makeTree(":", map(e => makeAST(e), exp), makeEdgeLabes(exp)) : makeCExpTree(exp)) :
    Error("lowut");

export const makeDefineExpTree = (exp: DefineExp): Tree | Error =>
    isAppExp(exp.val) ?  makeTree("Define", [makeVarDeclAST(exp.var), makeAST(exp.val)], ["var", "val"]):
    isLitExp(exp.val) ?  :
    Error("lowut");

// returns a string[] containing lables for array edges(0,1,2...)
export const makeEdgeLabes: (exp: Parsed[]) => string[] =
    function (exp: Parsed[]): string[] {
        let index: number = 0;
        return map(e => index++, exp);
    }



// Tests. Please uncomment
// const p1 = "(define x 4)";
// console.log(expToTree(p1));

// const p2 = "(define y (+ x 4))";
// console.log(expToTree(p2));

// const p3 = "(if #t (+ x 4) 6)";
// console.log(expToTree(p3));

// const p4 = "(lambda (x y) x)";
// console.log(expToTree(p4));