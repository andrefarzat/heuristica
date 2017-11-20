import Individual from "./Individual";
import Utils from "./Utils";


export default class Population {
    protected individuals: Individual[] = [];
    private dirty: boolean = true;

    public forEach(fn: (ind:Individual) => void): void {
        let len = this.individuals.length;
        for (let i = 0; i < len; i ++) {
            fn(this.individuals[i]);
        }
    }

    public get(index: number): Individual {
        return this.individuals[index];
    }

    public add(ind: Individual): void {
        this.individuals.push(ind);
        this.dirty = true;
    }

    public addAll(inds: Individual[]): void {
        inds.forEach(ind => this.add(ind));
    }

    public isDirty(): boolean {
        return this.dirty;
    }

    public getUsingRoullete(): Individual {
        if (this.isDirty()) {
            // TODO: add the roullete implementation
        }

        // TODO: Improve this
        let len = this.individuals.length;
        let index = Utils.nextInt(len);
        return this.get(index);
    }
}