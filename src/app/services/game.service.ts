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
    this.generateT3Cards();
    this.generateT2Cards();
    this.generateT1Cards();
  }

  private generateNobles(): void {
    console.log('generateNobles')

    this.nobles = []                                                                                              // clear nobles incase of new game

    for (var i = 0; i < 4; i++) {                                                                                 // get index limit from rule based on number of players
      let availableTypes = Object.keys(GemType)                                                                   // get all gem types from enum
      availableTypes.pop()                                                                                        // remove the last gem type, "GOLD", to genereate noble cost

      let cost: Gem[] = [];

      switch (Math.floor(Math.random() * 2)) {                                                                    // 0: 2 4 point costs, 1: 3 3 point costs
        case 0:
          this.generateCost(cost, 4, 2)
          break;
        case 1:
          this.generateCost(cost, 3, 3)
          break;
        default:
          console.log('default');
          break;
      }

      this.nobles.push(new Noble({ id: i, points: 3, cost }));
    }
    this.shuffleCards(this.nobles)
    console.log('nobles', this.nobles)
  }

  private generateT3Cards(): void {
    console.log('generateT3Cards')

    this.t3Cards = []                                                                                               // clear card array for new game

    let availableTypes = Object.keys(GemType).slice(0, Object.keys(GemType).length - 1)                             // get gem types excluding gold

    for (var i = 0; i < 2; i++) {                                                                                   // number of times each gem type should be made
      for (var j = 0; j < availableTypes.length; j++) {                                                             // create a card for each gem type
        let cost: Gem[] = [];                                                                                       // clear cost for new card

        let id = i * availableTypes.length + j;                                                                     // dynamic sequential id
        let value = { type: GemType[availableTypes[j]], value: 1 };                                                 // gem value. Each card is worth 1 type of gem
        this.generateCost(cost, Math.floor(Math.random() * 6) + 7);                                                 // generate cost with random value (7-12) 
        let points = Math.floor(Math.random() * 2) + 3;                                                             // randomize points (3-4)

        this.t3Cards.push(new Tier3Card({ id, value, cost, points }))                                               // add card to deck
      }
    }
    this.shuffleCards(this.t3Cards)                                                                                 // shuffle cards
    console.log('t3Cards', this.t3Cards)
  }

  private generateT2Cards(): void {
    console.log('generateT2Cards')

    this.t2Cards = []                                                                                               // clear card array for new game

    let availableTypes = Object.keys(GemType).slice(0, Object.keys(GemType).length - 1)                             // get gem types excluding gold

    for (var i = 0; i < 4; i++) {                                                                                   // number of times each gem type should be made
      for (var j = 0; j < availableTypes.length; j++) {                                                             // create a card for each gem type
        let cost: Gem[] = [];                                                                                       // clear cost for new card

        let id = i * availableTypes.length + j;                                                                     // dynamic sequential id
        let value = { type: GemType[availableTypes[j]], value: 1 };                                                 // gem value. Each card is worth 1 type of gem
        this.generateCost(cost, Math.floor(Math.random() * 4) + 5);                                                 // generate cost with random value (5-8) 
        let points = Math.floor(Math.random() * 2) + 1;                                                             // randomize points (1-2)

        this.t2Cards.push(new Tier2Card({ id, value, cost, points }))                                               // add card to deck
      }
    }
    this.shuffleCards(this.t2Cards)                                                                                 // shuffle cards
    console.log('t2Cards', this.t2Cards)
  }

  private generateT1Cards(): void {
    console.log('generateT1Cards')

    this.t1Cards = []                                                                                               // clear card array for new game

    let availableTypes = Object.keys(GemType).slice(0, Object.keys(GemType).length - 1)                             // get gem types excluding gold

    for (var i = 0; i < 6; i++) {                                                                                   // number of times each gem type should be made
      for (var j = 0; j < availableTypes.length; j++) {                                                             // create a card for each gem type
        let cost: Gem[] = [];                                                                                       // clear cost for new card

        let id = i * availableTypes.length + j;                                                                     // dynamic sequential id
        let value = { type: GemType[availableTypes[j]], value: 1 };                                                 // gem value. Each card is worth 1 type of gem
        this.generateCost(cost, Math.floor(Math.random() * 2) + 3);                                                 // generate cost with random value (3-4) 
        let points = Math.floor((Math.random() + .25));                                                             // randomize points (0-1) weighted toward 0

        this.t1Cards.push(new Tier1Card({ id, value, cost, points }))                                               // add card to deck
      }
    }
    this.shuffleCards(this.t1Cards)                                                                                 // shuffle cards
    console.log('t1Cards', this.t1Cards)
  }

  private generateCost(cost: Gem[], value: number, numOfCosts?: number): void {
    console.log('generateCost')

    let availableTypes = Object.keys(GemType)                                                                       // get all gem types from enum
    availableTypes.pop()                                                                                            // remove the last gem type, "GOLD", to genereate cost

    if (numOfCosts) {
      for (var i = 0; i < numOfCosts; i++) {
        let index = Math.floor(Math.random() * availableTypes.length);                                              // get random index value from available gem types
        cost.push({ type: GemType[availableTypes[index]], value });                                                 // create a cost using random type
        availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)                // remove used gem type so it is not repeated
      }
    } else {
      let numOfCostTypes = Math.floor(Math.random() * 4) + 1;                                                       // cards should have 1-4 different gem type costs
      if (numOfCostTypes > value) {                                                                                 // ensure a min value of 1 for each gem type costs
        numOfCostTypes = value;
      }
      let numOfTokens = 0;                                                                                          // initialize number of gems used

      for (var i = 0; i < numOfCostTypes; i++) {                                                                    // create a cost this many times

        let max = value - numOfCostTypes + 1 + i;                                                                   // max value a cost can be taking into account how many gem types are on the card and the total cost that was passed or remaining
        let min = (i + 1) == numOfCostTypes ? max : 1;                                                              // min value a cost can be. Will be either 1 or equal to the max value if it is the last gem type

        numOfTokens = Math.floor(Math.random() * (max - min + 1)) + min;                                            // how much this gem type will be in the total cost

        value -= numOfTokens;                                                                                       // reduce the remaining value by the number of gems being assigned to this cost

        let index = Math.floor(Math.random() * availableTypes.length);                                              // get random index value from available gem types
        cost.push({ type: GemType[availableTypes[index]], value: numOfTokens });                                    // create a cost using random type
        availableTypes = availableTypes.filter(type => GemType[type] !== cost[cost.length - 1].type)                // remove used gem type so it is not repeated
      }
    }
  }

  private shuffleCards(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
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
