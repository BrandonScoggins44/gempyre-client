import { Gem } from "./gem";

export interface Card {
    id: number;
    tier: number;       // used for displaying tier while card is held by a player or on the deck
    value: Gem;
    cost: Gem[];
    points: number;
}
