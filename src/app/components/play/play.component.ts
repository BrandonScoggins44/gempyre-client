import { Component, OnInit } from '@angular/core';
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
  private gempyreModalButton: HTMLElement;

  // Move to alert enum
  private ALERT_NONE = undefined;
  private ALERT_SYSTEM_ERROR = 'Internal error. Please contact the adminastrator.'
  private ALERT_MUST_TAKE_TURN_ACTION = 'No action has been taken. You must take an action before ending your turn.'
  private ALERT_INVALID_GEM_SELECTION = 'Invalid gem selection. You must gather 3 unique gems, or 2 of the same gem type.'
  private ALERT_OVERLAPPING_ACTIONS = 'Another action is already being performed. (add option to clear actions and continue)'
  private ALERT_GEM_NOT_AVAILABLE = 'Can not gather more of that gem. Not enough are available in the gem bank.'
  private ALERT_CAN_NOT_AFFORD_CARD = 'You do not have enough gems to purchase that card.'

  public alert: string;

  // Move to alert type enum
  private ALERT_TYPE_NONE = undefined;
  private ALERT_TYPE_SYSTEM_ERROR = 'System Error'
  private ALERT_TYPE_USER_ERROR = 'Invalid Play'

  public alertType: string;

  // Move to enum (turn actions)    Buy/Reserve Card or Gather Gems
  private ACTION_NONE = 'No Action'
  private ACTION_GATHER_GEMS = 'Gather Gems'
  private ACTION_BUY_CARD = 'Buy Card'
  private ACTION_RESERVE_CARD = 'Reserve Card'

  private turnAction: string;
  private activePlayer: number;

  public gatheredGems: GemType[];
  public buyingCard: Card;
  private buyingCardIndex: number;

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
    this.alert = this.ALERT_NONE
    this.alertType = this.ALERT_TYPE_NONE
    this.gempyreModalButton = (document.querySelector('#gempyreModalButton') as HTMLElement);

    this.activePlayer = 0
  }

  public showGempyreModal(alertType: string, alert: string): void {
    this.alertType = alertType;
    this.alert = alert;
    this.gempyreModalButton.click();
  }

  public showTurnAction(): void {
    (document.querySelector('#turnActionButton') as HTMLElement).click();
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
        console.log('getCostColor() : match not found')
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  public getModalBackdropColor() {
    switch (this.alertType) {
      case this.ALERT_TYPE_NONE: {
        break;
      }
      case this.ALERT_TYPE_SYSTEM_ERROR: {
        return {
          'background-color': 'rgba(255, 0, 0, .05)'
        }
      }
      case this.ALERT_TYPE_USER_ERROR: {
        return {
          'background-color': 'rgba(0, 0, 255, .05)'
        }
      }
      default: {
        console.log('getModalBackdropColor() : match not found')    // don't show modal here since it would be recursive
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
        console.log('getGemColor() : match not found')
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  // use or remove this
  public getGatheredGemCount(gem: GemType): number {
    return this.gatheredGems.filter((gemType) => { return gemType == gem }).length
  }

  // remove or improve this
  public getGemTypeFromString(gemName: String): GemType {
    return GemType[gemName as GemType]
  }

  private startNewTurn(): void {
    console.log('startNewTurn')
    // establish turn variables
    this.turnAction = this.ACTION_NONE
    this.gatheredGems = []
    this.buyingCard = undefined
  }

  private endTurn(): void {
    console.log('endTurn')

    // validate turn action
    if (this.validateTurnAction()) {
      this.implementTurnAction()
      this.startNewTurn()
    } else {
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.alert);
    }
  }

  private validateTurnAction(): boolean {
    console.log('validateTurnAction')
    console.log('turnAction', this.turnAction)

    switch (this.turnAction) {
      case this.ACTION_NONE: {
        this.alert = this.ALERT_MUST_TAKE_TURN_ACTION
        return false;
      }
      case this.ACTION_GATHER_GEMS: {
        if (this.gatheredGems.length < 2) {
          this.alert = this.ALERT_INVALID_GEM_SELECTION
          return false
        }

        if (this.gatheredGems.length == 3 || this.gatheredGems[0] == this.gatheredGems[1])
          return true
        else {
          this.alert = this.ALERT_INVALID_GEM_SELECTION
          return false
        }
      }
      case this.ACTION_BUY_CARD: {
        if (this.buyingCard && this.buyingCardIndex)
          return true
        else
          return false
      }
      default: {
        this.alert = this.ALERT_MUST_TAKE_TURN_ACTION
        return false
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
          this.updatePlayerTokens(gem, 1)
        }
        break;
      }
      case this.ACTION_BUY_CARD: {
        this.finalizeBuyCard()
        break;
      }
      default: {
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  public finalizeBuyCard(): void {
    console.log('card', this.buyingCard)
    if (this.buyingCard) {
      switch (this.buyingCard.tier) {
        case 1: {
          this.gameService.updateShowing(this.gameService.getT1Deck(), this.gameService.getT1Showing(), this.buyingCardIndex)
          break;
        }
        case 2: {
          this.gameService.updateShowing(this.gameService.getT2Deck(), this.gameService.getT2Showing(), this.buyingCardIndex)
          break;
        }
        case 3: {
          this.gameService.updateShowing(this.gameService.getT3Deck(), this.gameService.getT3Showing(), this.buyingCardIndex)
          break;
        }
        default: {
          console.log('tier not found')
          this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
          break;
        }
      }
    }
  }

  private updateBankTokens(gemType: GemType, value: number): void {
    let newValue = this.gameService.getBankTokens().get(gemType) + value
    this.gameService.getBankTokens().set(gemType, newValue >= 0 ? newValue : 0)
  }

  private updatePlayerTokens(gemType: GemType, value: number): void {
    let newValue = this.gameService.getPlayers()[this.activePlayer].gems.get(gemType) + value
    this.gameService.getPlayers()[this.activePlayer].gems.set(gemType, newValue >= 0 ? newValue : 0)
  }

  public gatherGem(gemType: GemType): void {

    // check that action is available
    if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_GATHER_GEMS) {
      console.log('Performing other action. Cannot gather gems')
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_OVERLAPPING_ACTIONS);
      return
    }

    if (gemType != GemType.GOLD) {
      // check that gem is available
      if (!this.gemIsAvailable(gemType)) {
        console.log('cannot gather ', gemType, '. None are available in the gem bank.')
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_GEM_NOT_AVAILABLE);
        return
      }

      if (this.gatheredGems.length < 2) {
        this.gatheredGems.push(gemType)
      } else if (this.gatheredGems.includes(gemType)
        || this.gatheredGems.filter((gem) => { return gem == this.gatheredGems[0] }).length != 1
        || this.gatheredGems.length >= 3) {
        console.log('Can only gather two of the same gem or three unique gems in a turn')
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_INVALID_GEM_SELECTION);
      } else {
        this.gatheredGems.push(gemType)
      }
    } else {
      console.log('cannot gather gold')
    }

    if (this.gatheredGems.length > 0) {
      this.turnAction = this.ACTION_GATHER_GEMS
    }
  }

  private gemIsAvailable(gemType: GemType): boolean {
    return this.gameService.getBankTokens().get(gemType) > 0
  }

  public returnGem(gemType: GemType): void {
    this.gatheredGems.splice(this.gatheredGems.findIndex((gem) => { return gem == gemType }), 1)

    if (this.gatheredGems.length == 0) {
      this.turnAction = this.ACTION_NONE
    }
  }

  public buyCard(card: Card, showingIndex: number): void {
    console.log("buyCard", card)

    // check that action is available
    if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_BUY_CARD) {
      console.log('Performing other action. Cannot gather gems')
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_OVERLAPPING_ACTIONS);
      return
    }

    if (this.activePlayerCanAffordCard(card)) {
      this.turnAction = this.ACTION_BUY_CARD
      this.buyingCard = card
      this.buyingCardIndex = showingIndex
    } else {
      console.log('player', this.activePlayer, 'can not afford card:', card)
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_CAN_NOT_AFFORD_CARD);
    }
  }

  public activePlayerCanAffordCard(card: Card): boolean {
    console.log('activePlayerCanAffordCard')
    return true;

  }

  public returnBuyingCard(): void {
    console.log('returnBuyingCard')

    this.turnAction = this.ACTION_NONE
    this.buyingCard = undefined
    this.buyingCardIndex = undefined
  }
}
