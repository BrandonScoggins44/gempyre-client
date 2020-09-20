import { GemType } from '../enums/gem-type.enum';

export class Token {
    type: GemType;
    value: number;

    constructor({ type, value }) {
        this.type = type;
        this.value = value;
    }
}
