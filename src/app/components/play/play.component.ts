import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/classes/player';
import { GemType } from 'src/app/enums/gem-type.enum';
import { Card } from 'src/app/interfaces/card';
import { GameService } from "../../services/game.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public gemTypes = Object.keys(GemType)

  // Move to enum (turn actions)    Buy/Reserve Card or Gather Gems
  private ACTION_NONE = 'No Action'
  private ACTION_GATHER_GEMS = 'Gather Gems'

  private turnAction: string;
  private gatheredGems: GemType[];

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    // temp
    this.startNewTurn()
  }

  public getCostColor(leadingChar: string) {
    switch (leadingChar) {
      case 'E': {
        return {
          'color': 'green'
        }
      }
      case 'D': {
        return {
          'color': 'gray'
        }
      }
      case 'S': {
        return {
          'color': 'blue'
        }
      }
      case 'O': {
        return {
          'color': 'black'
        }
      }
      case 'R': {
        return {
          'color': 'red'
        }
      }
      case 'G': {
        return {
          'color': 'orange'
        }
      }
      default: {
        console.log('match not found')
        break;
      }
    }
  }

  public getGemColor(leadingChar: string) {
    switch (leadingChar) {
      case 'E': {
        return 'bg-success'
      }
      case 'D': {
        return 'bg-secondary'
      }
      case 'S': {
        return 'bg-primary'
      }
      case 'O': {
        return 'bg-dark'
      }
      case 'R': {
        return 'bg-danger'
      }
      case 'G': {
        return 'bg-warning'
      }
      default: {
        console.log('match not found')
        break;
      }
    }
  }

  // use or remove this
  public getGatheredGemCount(gem: GemType): number {
    return this.gatheredGems.filter((gemType) => { return gemType == gem }).length
  }

  public getGemTypeFromString(gemName: String): GemType {
    return GemType[gemName as GemType]
  }

  private startNewTurn(): void {
    console.log('startNewTurn')
    // establish turn variables
    this.turnAction = this.ACTION_NONE
    this.gatheredGems = []
  }

  private endTurn(): void {
    console.log('endTurn')

    // validate turn action
    if (this.validateTurnAction()) {
      this.implementTurnAction()
      this.startNewTurn()
    } else {
      console.log('cannont pass turn without taking an action')
    }
  }

  private validateTurnAction(): boolean {
    console.log('validateTurnAction')
    console.log('turnAction', this.turnAction)

    switch (this.turnAction) {
      case this.ACTION_NONE: {
        console.log('No action taken. Please take an action.')
        return false;
      }
      case this.ACTION_GATHER_GEMS: {
        if (this.gatheredGems.length < 2) {
          console.log('Not enough gems selected')
          return false
        }

        if (this.gatheredGems.length == 3 || this.gatheredGems[0] == this.gatheredGems[1])
          return true
        else
          return false
      }
      default: {
        console.log('no actions')
        break;
      }
    }
  }

  private implementTurnAction(): void {
    console.log('implementTurnAction')
    console.log('turnAction', this.turnAction)

    switch (this.turnAction) {
      case this.ACTION_GATHER_GEMS: {
        for (let gem of this.gatheredGems) {
          this.updateBankTokens(gem, -1)
          this.updatePlayerTokens(0, gem, 1)
        }
        break;
      }
      default: {
        console.log('no actions')
        break;
      }
    }
  }

  public buyCard(card: Card, showingIndex: number): void {
    console.log('card', card)
    if (card) {
      switch (card.tier) {
        case 1: {
          this.gameService.updateShowing(this.gameService.getT1Deck(), this.gameService.getT1Showing(), showingIndex)
          break;
        }
        case 2: {
          this.gameService.updateShowing(this.gameService.getT2Deck(), this.gameService.getT2Showing(), showingIndex)
          break;
        }
        case 3: {
          this.gameService.updateShowing(this.gameService.getT3Deck(), this.gameService.getT3Showing(), showingIndex)
          break;
        }
        default: {
          console.log('tier not found')
          break;
        }
      }
    }
  }

  private updateBankTokens(gemType: GemType, value: number): void {
    let newValue = this.gameService.getBankTokens().get(gemType) + value
    this.gameService.getBankTokens().set(gemType, newValue >= 0 ? newValue : 0)
  }

  private updatePlayerTokens(player: number, gemType: GemType, value: number): void {
    let newValue = this.gameService.getPlayers()[player].gems.get(gemType) + value
    this.gameService.getPlayers()[player].gems.set(gemType, newValue >= 0 ? newValue : 0)
  }

  public gatherGem(gemType: GemType): void {

    // check that action is available
    if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_GATHER_GEMS) {
      console.log('Performing other action. Cannot gather gems')
      return
    } else {
      this.turnAction = this.ACTION_GATHER_GEMS
    }

    // checkGemIsAvailable(gemType)

    if (gemType != GemType.GOLD) {

      if (this.gatheredGems.length < 2) {
        this.gatheredGems.push(gemType)
      } else if (this.gatheredGems.includes(gemType)
        || this.gatheredGems.filter((gem) => { return gem == this.gatheredGems[0] }).length != 1
        || this.gatheredGems.length >= 3) {
        console.log('Can only gather two of the same gem or three unique gems in a turn')
      } else {
        this.gatheredGems.push(gemType)
      }
    } else {
      console.log('cannot gather gold')
    }
    console.log('Gathered Gems', this.gatheredGems)
  }

  public returnGem(gemType: GemType): void {
    this.gatheredGems.splice(this.gatheredGems.findIndex((gem) => { return gem == gemType }), 1)
  }

  public getGatheredGems(): GemType[] {
    return this.gatheredGems;
  }

  public setGatheredGems(gatheredGems: GemType[]): void {
    this.gatheredGems = gatheredGems;
  }
}
