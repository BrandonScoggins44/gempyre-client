import { GemType } from '../enums/gem-type.enum';

export interface Card {
    id: number;
    tier: number;       // used for displaying tier while card is held by a player or on the deck
    value: GemType;
    cost: Map<GemType, number>;
    points: number;
}
