import { Noble as INoble } from "../interfaces/noble";
import { Gem } from '../interfaces/gem';

export class Noble implements INoble {
    id: number;
    points: number;
    cost: Gem[];

    constructor({ id, points, cost }) {
        this.id = id;
        this.points = points;
        this.cost = cost;
    }
}
