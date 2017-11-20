import Individual from "../Individual";

export default interface CrossoverOperator {
    cross(father: Individual, mother: Individual): Individual;
}