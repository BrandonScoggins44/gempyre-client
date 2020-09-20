import { GemType } from '../enums/gem-type.enum';

export interface Noble {
    id: number;
    points: number;
    cost: Map<GemType, number>;
}
