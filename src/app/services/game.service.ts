import { Injectable } from '@angular/core';
import { Noble } from '../classes/noble';
import { Tier3Card } from '../classes/tier3-card';
import { Tier2Card } from '../classes/tier2-card';
import { Tier1Card } from '../classes/tier1-card';
import { Token } from '../classes/token';
import { GemType } from '../enums/gem-type.enum';
import { Gem } from '../interfaces/gem';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private nobles: Noble[];
  private t3Cards: Tier3Card[];
  private t2Cards: Tier2Card[];
  private t1Cards: Tier1Card[];
  private tokens: Token[];
  private numberOfPlayers: number = 3;

  constructor() { }

  public buildGame(): void {
    this.generateNobles();
  }

  public generateNobles(): void {
    console.log('generateNobles')

    this.nobles = []                                                                                              // clear nobles incase of new game

    for (var i = 0; i < 4; i++) {                                                                                 // get index limit from rule based on number of players
      let availableTypes = Object.keys(GemType)                                                                   // get all gem types from enum
      availableTypes.pop()                                                                                        // remove the last gem type, "GOLD", to genereate noble cost

      let cost: Gem[] = [];
      let index;

      switch (Math.floor(Math.random() * 2)) {                                                                    // 0: 2 4 point costs, 1: 3 3 point costs
        case 0:
          index = Math.floor(Math.random() * availableTypes.length);                                              // get random index value from available gem types
          cost.push({ type: GemType[availableTypes[index]], value: 4});                                           // create a cost using random type
          availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)            // remove used gem type so it is not repeated
          
          index = Math.floor(Math.random() * availableTypes.length);                                              // repeat using remaing types
          cost.push({ type: GemType[availableTypes[index]], value: 4});
          availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)
          break;
        case 1:
          index = Math.floor(Math.random() * availableTypes.length);                                              // described above
          cost.push({ type: GemType[availableTypes[index]], value: 3});
          availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)
          
          index = Math.floor(Math.random() * availableTypes.length);                                              // described above
          cost.push({ type: GemType[availableTypes[index]], value: 3});
          availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)
          
          index = Math.floor(Math.random() * availableTypes.length);                                              // described above
          cost.push({ type: GemType[availableTypes[index]], value: 3});
          availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)
          break;
        default:
          console.log('default');
          break;
      }

      this.nobles.push(new Noble({ id: i, points: 3, cost }));
    }
    console.log('nobles', this.nobles)
  }

  public getNobles(): Noble[] {
    return this.nobles;
  }

  public setNobles(nobles: Noble[]): void {
    this.nobles = nobles;
  }

  public getT3Cards(): Tier3Card[] {
    return this.t3Cards;
  }

  public setT3Cards(t3Cards: Tier3Card[]): void {
    this.t3Cards = t3Cards;
  }

  public getT2Cards(): Tier2Card[] {
    return this.t2Cards;
  }

  public setT2Cards(t2Cards: Tier2Card[]): void {
    this.t2Cards = t2Cards;
  }

  public getT1Cards(): Tier1Card[] {
    return this.t1Cards;
  }

  public setT1Cards(t1Cards: Tier1Card[]): void {
    this.t1Cards = t1Cards;
  }

  public getTokens(): Token[] {
    return this.tokens;
  }

  public setTokens(tokens: Token[]): void {
    this.tokens = tokens;
  }

  public getNumberOfPlayers(): number {
    return this.numberOfPlayers;
  }

  public setNumberOfPlayers(numberOfPlayers: number): void {
    this.numberOfPlayers = numberOfPlayers;
  }
}
