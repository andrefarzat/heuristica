import Func from "./nodes/Func";
import Individual from "./Individual";
import Node from "./nodes/Node";
import Terminal from "./nodes/Terminal"
import Utils from "./Utils";


export default class IndividualFactory {
    public constructor(public leftChars: string[], public rightChars: string[]) {}

    public createFromString(phrase: string) : Individual {
        let ind = new Individual();
        let currentFunc = new Func();
        ind.tree = currentFunc;

        phrase.split('').forEach(letter => {
            if (!currentFunc.left) {
                currentFunc.left = new Terminal(letter);
            } else {
                let func = new Func();
                func.type = Func.Types.concatenation;
                func.left = new Terminal(letter);

                currentFunc.right = func;
                currentFunc = func;
            }
        });

        return ind;
    }

    public getRandomCharFromLeft(): Terminal {
        let char = Utils.getRandomlyFromList(this.leftChars);
        return new Terminal(char);
    }

    public getRandomCharFromRight(): Terminal {
        let char = Utils.getRandomlyFromList(this.rightChars);
        return new Terminal(char);
    }

    public appendAtEnd(ind: Individual, node: Node): Individual {
        let newInd = ind.clone();
        let leaf = newInd.tree.getLeastFunc();
        let func = new Func();
        func.type = Func.Types.concatenation;
        func.left = leaf.right;
        func.right = node;
        return newInd;
    }

    public appendAtBeginning(ind: Individual, node: Node): Individual {
        let newInd = ind.clone();
        let func = new Func();
        func.type = Func.Types.concatenation;
        func.left = node;
        func.right = newInd.tree;
        newInd.tree = func;
        return newInd;
    }

    public insertRandomly(ind: Individual, node: Node): Individual {
        let newInd = ind.clone();
        let currentFunc = Utils.getRandomlyFromList(newInd.tree.getFuncs());
        let func = new Func();
        func.type = Func.Types.concatenation;
        func.left = node;
        func.right = currentFunc;

        let parent = newInd.getParentOf(currentFunc);
        if (parent) {
            if (parent.side == 'left') parent.func.left = func;
            else parent.func.right = func;
        }

        return newInd;
    }

    public swapRandomly(ind: Individual, node: Node): Individual {
        let newInd = ind.clone();
        let currentTerminal = Utils.getRandomlyFromList(newInd.tree.getTerminals());
        let parent = newInd.getParentOf(currentTerminal);
        if (parent) {
            if (parent.side === 'left') parent.func.left = node;
            else parent.func.right = node;
        }

        return newInd;
    }

    public addStartOperator(ind: Individual): Individual {
        let node = this.getRandomCharFromLeft();
        let newInd = ind.clone();
        let funcStartOperator = newInd.tree.getFuncs().find(current => current.type == Func.Types.lineBegin);

        if (!funcStartOperator) {
            let func = new Func();
            func.type = Func.Types.lineBegin;
            func.left = node;
            func.right = newInd.tree;
            newInd.tree = func;
        } else {
            funcStartOperator.left = node;
        }

        return newInd;
    }

    public addEndOperator(ind: Individual): Individual {
        let node = this.getRandomCharFromLeft();
        let newInd = ind.clone();
        let funcEndOperator = newInd.tree.getFuncs().find(current => current.type == Func.Types.lineEnd);

        if (!funcEndOperator) {
            let func = new Func();
            func.type = Func.Types.lineEnd;
            func.left = node;
            func.right = newInd.tree;
            newInd.tree = func;
        } else {
            funcEndOperator.left = node;
        }

        return newInd;
    }

    public addToNegation(ind: Individual, node: Node): Individual {
        let newInd = ind.clone();
        let func = newInd.tree.getFuncs().find(current => current.type == Func.Types.negation);

        if (!func) {
            func = new Func();
            func.type = Func.Types.negation;
            func.left = new Terminal('');
            func.right = node;
            return Utils.nextBoolean() ? this.appendAtBeginning(newInd, func) : this.appendAtEnd(newInd, func);
        }

        if (func.left instanceof Terminal && func.left.toString() == '') {
            func.left = node;
        } else if (func.right instanceof Terminal && func.right.toString() == '') {
            func.right = node;
        } else {
            let newFunc = new Func();
            newFunc.type = Func.Types.concatenation;
            newFunc.left = node;
            newFunc.right = func;

            let parent = newInd.getParentOf(func);
            if (parent.side == 'left') parent.func.left = newFunc;
            else parent.func.right = newFunc;
        }

        return newInd;
    }

    public generateNegationNodeFromList(chars: string[]): Func {
        let func = new Func();
        func.type = Func.Types.negation;
        func.left = new Terminal('');
        func.right = this.getRandomCharFromRight();
        return func;
    }

    public generateRandomlyFrom(ind: Individual): Individual {
        switch (Utils.nextInt(4)) {
            case 0: return this.addStartOperator(ind);
            case 1: return this.addEndOperator(ind);
            default: break;
        }

        let node = Utils.nextBoolean()
            ? this.getRandomCharFromLeft()
            : this.getRandomCharFromRight();

        switch (Utils.nextInt(5)) {
            case 0: return this.appendAtEnd(ind, node);
            case 1: return this.appendAtBeginning(ind, node);
            case 2: return this.insertRandomly(ind, node);
            case 3: return this.swapRandomly(ind, node);
            case 4: return this.addToNegation(ind, node);
        }

        return this.appendAtEnd(ind, node);
    }

    public generateRandom(depth: number): Individual {
        let ind = new Individual();
        ind.tree = new Func();
        ind.tree.left = this.getRandomCharFromLeft();
        ind.tree.right = this.getRandomCharFromLeft();

        while (--depth > 0) {
            ind = this.generateRandomlyFrom(ind);
        }

        return ind;
    }
}
