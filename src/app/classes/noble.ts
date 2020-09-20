import { GemType } from '../enums/gem-type.enum';
import { Noble as INoble } from "../interfaces/noble";

export class Noble implements INoble {
    id: number;
    points: number;
    cost: Map<GemType, number>;

    constructor({ id, points, cost }) {
        this.id = id;
        this.points = points;
        this.cost = cost;
    }
}
