import { Card } from "../interfaces/card"
import { Gem } from '../interfaces/gem';

export class Tier2Card implements Card {
    id: number;
    tier: number = 2;
    value: Gem;
    cost: Gem[];
    points: number;

    constructor({ id, value, cost, points }) {
        this.id = id;
        this.value = value;
        this.cost = cost;
        this.points = points;
    }
}
