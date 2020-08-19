import { Gem } from '../interfaces/gem';
import { GemType } from '../enums/gem-type.enum';

export class Token implements Gem {
    type: GemType;
    value: number;

    constructor({ type, value }) {
        this.type = type;
        this.value = value;
    }
}
