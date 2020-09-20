import { GemType } from '../enums/gem-type.enum';
import { Card } from "../interfaces/card";

export class Tier1Card implements Card {
    id: number;
    tier: number = 1;
    value: GemType;
    cost: Map<GemType, number>;
    points: number;

    constructor({ id, value, cost, points }) {
        this.id = id;
        this.value = value;
        this.cost = cost;
        this.points = points;
    }
}
