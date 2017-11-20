import CrossoverOperator from "./CrossoverOperator";
import Individual from "../Individual";
import Utils from "../Utils";

export default class SubtreeCrossover implements CrossoverOperator {
    public cross(father: Individual, mother: Individual) : Individual {
        let neo = father.clone();
        // 1. Getting a random function from father
        let func = Utils.getRandomlyFromList(father.tree.getFuncs());

        // 2. Getting a random node from mother
        let node = Utils.getRandomlyFromList(mother.tree.getNodes());

        // 3. Replacing the node from mother's node
        let shouldBeLeft = Utils.nextBoolean();
        if (shouldBeLeft) {
            func.left = node;
        } else {
            func.right = node;
        }

        // 4. Returning from saturn
        return neo;
    }
}