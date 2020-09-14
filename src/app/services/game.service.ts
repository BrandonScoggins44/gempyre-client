import { Injectable } from '@angular/core';
import { Noble } from '../classes/noble';
import { Player } from '../classes/player';
import { Tier1Card } from '../classes/tier1-card';
import { Tier2Card } from '../classes/tier2-card';
import { Tier3Card } from '../classes/tier3-card';
import { GemType } from '../enums/gem-type.enum';
import { Card } from '../interfaces/card';
import { Gem } from '../interfaces/gem';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private nobles: Noble[];

  private t3Deck: Tier3Card[];
  private t2Deck: Tier2Card[];
  private t1Deck: Tier1Card[];

  private t3Showing: Tier3Card[];
  private t2Showing: Tier2Card[];
  private t1Showing: Tier1Card[];

  private bankTokens: Map<GemType, number>;
  private numberOfPlayers: number = 2;
  private players: Player[];

  private gameInProgress: boolean = false;

  constructor() { }

  public buildGame(): void {
    this.setGameInProgress(true)

    this.generateNobles();
    this.generateTokens();
    this.generatePlayers();

    this.t1Deck = []
    this.t2Deck = []
    this.t3Deck = []

    this.t1Showing = []
    this.t2Showing = []
    this.t3Showing = []

    this.generateTierCards(this.t3Deck, this.t3Showing, 2, 3, 6, 7, 2, 3, 0)
    this.generateTierCards(this.t2Deck, this.t2Showing, 4, 2, 4, 5, 2, 1, 0)
    this.generateTierCards(this.t1Deck, this.t1Showing, 6, 1, 2, 3, 1, 0, .25)
  }

  private generateNobles(): void {
    console.log('generateNobles')

    this.nobles = []                                                                                              // clear nobles incase of new game

    for (var i = 0; i < (this.numberOfPlayers < 4 ? 4 : 5); i++) {                                                // get index limit from rule based on number of players

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

  private generateTokens(): void {
    console.log('generateTokens')

    this.bankTokens = new Map<GemType, number>();

    let gemTypes = Object.keys(GemType)

    for (var type of gemTypes) {
      this.bankTokens.set(GemType[type], this.numberOfPlayers * 2 + 2)
    }
    console.log('bankTokens', this.bankTokens)
  }

  private generatePlayers(): void {
    console.log('generatePlayers')

    this.players = [];                                                                                            // clear players for new game

    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.players.push(new Player({ id: i, name: `Player ${i + 1}` }))
    }
    console.log('players', this.players)
  }

  private generateTierCards(deck: Card[], showing: Card[], muliplier: number, tier: number, costRange: number, costMin: number, pointRange: number, pointMin: number, pointModifier: number): void {
    console.log('generateTierCards', 'tier:', tier)

    deck.splice(0)                                                                                                  // clear card array for new game
    showing.splice(0)

    let availableTypes = Object.keys(GemType).slice(0, Object.keys(GemType).length - 1)                             // get gem types excluding gold

    for (var i = 0; i < muliplier; i++) {                                                                           // number of times each gem type should be made
      for (var j = 0; j < availableTypes.length; j++) {                                                             // create a card for each gem type
        let cost: Gem[] = [];                                                                                       // clear cost for new card

        let id = i * availableTypes.length + j;                                                                     // dynamic sequential id
        let value = { type: GemType[availableTypes[j]], value: 1 };                                                 // gem value. Each card is worth 1 type of gem
        this.generateCost(cost, Math.floor(Math.random() * costRange) + costMin);                                   // generate cost with random value
        let points = Math.floor((Math.random() + pointModifier) * pointRange) + pointMin;                           // randomize points

        switch (tier) {
          case 3: {
            deck.push(new Tier3Card({ id, value, cost, points }));
            break;
          }
          case 2: {
            deck.push(new Tier2Card({ id, value, cost, points }));
            break;
          }
          case 1: {
            deck.push(new Tier1Card({ id, value, cost, points }));
            break;
          }
          default: {
            console.log('No matching tier')
            break;
          }
        }
      }
    }
    this.shuffleCards(deck)                                                                                         // shuffle cards
    this.populateShowing(deck, showing)                                                                             // reveal top 4 cards from pile         
    console.log('Deck:', deck)
    console.log('Showing:', showing)
  }

  public populateShowing(deck: Card[], showing: Card[]): void {
    if (!deck || !showing) {
      console.log('Error in populateShowing')
      return
    }

    while (deck.length > 0 && showing.length < 4) {
      showing.push(deck.pop())
    }
  }

  public updateShowing(deck: Card[], showing: Card[], showingIndex: number): void {
    if (!deck || !showing || showingIndex == NaN) {
      console.log('Error in updateShowing')
      return
    }

    showing[showingIndex] = deck.pop()
    console.log('showing', showing)
  }

  private generateCost(cost: Gem[], value: number, numOfCosts?: number): void {
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

  public getT3Deck(): Tier3Card[] {
    return this.t3Deck;
  }

  public setT3Deck(t3Deck: Tier3Card[]): void {
    this.t3Deck = t3Deck;
  }

  public getT2Deck(): Tier2Card[] {
    return this.t2Deck;
  }

  public setT2Deck(t2Deck: Tier2Card[]): void {
    this.t2Deck = t2Deck;
  }

  public getT1Deck(): Tier1Card[] {
    return this.t1Deck;
  }

  public setT1Deck(t1Deck: Tier1Card[]): void {
    this.t1Deck = t1Deck;
  }

  public getT3Showing(): Tier3Card[] {
    return this.t3Showing;
  }

  public setT3Showing(t3Showing: Tier3Card[]): void {
    this.t3Showing = t3Showing;
  }

  public getT2Showing(): Tier2Card[] {
    return this.t2Showing;
  }

  public setT2Showing(t2Showing: Tier2Card[]): void {
    this.t2Showing = t2Showing;
  }

  public getT1Showing(): Tier1Card[] {
    return this.t1Showing;
  }

  public setT1Showing(t1Showing: Tier1Card[]): void {
    this.t1Showing = t1Showing;
  }

  public getBankTokens(): Map<GemType, number> {
    return this.bankTokens;
  }

  public setBankTokens(bankTokens: Map<GemType, number>): void {
    this.bankTokens = bankTokens;
  }

  public getNumberOfPlayers(): number {
    return this.numberOfPlayers;
  }

  public setNumberOfPlayers(numberOfPlayers: number): void {
    this.numberOfPlayers = numberOfPlayers;
  }

  public getGameInProgress(): boolean {
    return this.gameInProgress;
  }

  public setGameInProgress(gameInProgress: boolean): void {
    this.gameInProgress = gameInProgress;
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public setPlayers(players: Player[]): void {
    this.players = players;
  }
}
