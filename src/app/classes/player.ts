import { GemType } from '../enums/gem-type.enum';
import { Card } from '../interfaces/card';

export class Player {
    id: number;
    name: string;
    points: number;
    heldCards: Card[];
    gems: Map<GemType, number>;
    buyingPower: Map<GemType, number>;


    constructor({ id, name }) {
        this.id = id;
        this.name = name;
        this.points = 0;
        this.heldCards = [];
        this.gems = new Map<GemType, number>();
        this.buyingPower = new Map<GemType, number>();
    }
}
