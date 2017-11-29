import MutationOperator from "./MutationOperator";
import Individual from "../Individual";
import Utils from "../Utils";


export default class PointMutation implements MutationOperator {
    public mutate(father: Individual, values: string[]): Individual {
        let neo = father.clone();
        let node = Utils.getRandomlyFromList(neo.getNodes());
        node.mutate(values);

        return neo;
    }
}