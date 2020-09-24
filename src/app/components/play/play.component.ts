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

  public gemTypes = Object.values(GemType)
  private gempyreModalButton: HTMLElement;

  // Move to alert enum
  private ALERT_NONE = undefined;
  private ALERT_SYSTEM_ERROR = 'Internal error. Please contact the adminastrator.'
  public ALERT_MUST_TAKE_TURN_ACTION = 'No action has been taken. You must take an action before ending your turn.'
  private ALERT_INVALID_GEM_SELECTION = 'Invalid gem selection. You must gather 3 unique gems, or 2 of the same gem type.'
  private ALERT_OVERLAPPING_ACTIONS = 'Another action is already being performed.'
  private ALERT_GEM_NOT_AVAILABLE = 'Can not gather more of that gem. Not enough are available in the gem bank.'
  private ALERT_CAN_NOT_AFFORD_CARD = 'You do not have enough gems to purchase that card, and you already have the max number of cards reserved.'
  public ALERT_CAN_NOT_AFFORD_RESERVED_CARD = 'You do not have enough gems to purchase that reserved card.'
  public ALERT_RESERVE_CARD = 'You do not have enough gems to purchase that card. Would you like to reserve it instead?'
  private ALERT_VICTORY = /* Player */ ' has won the game!'
  private ALERT_EARNED_NOBLE = /* Player */ ' has impressed a Noble gaining there support (points).'
  public ALERT_MAX_GEMS = 'Gathering these gems will cause you to exceed the maximum number of gems a player can hold (10). Would you like to exchange some of the gems you already have for these new ones?'
  public ALERT_EXCHANGE = 'To exchange gems, select gems you would like to gain from the gem bank as usual. Then select the gems you want to exhange with them by clicking on the gem in your player pool.'
  public ALERT_NO_GEM_TO_EXCHANGE = 'You do not have enough of that gem to exchange.'
  public ALERT_BAD_EXCHANGE = 'You can only exchange up to the number of gems gained. The difference must not cause you to exceed 10 gems.'
  private ALERT_EXCHANGE_CRITERIA_NOT_MET = 'You can only exchange gems if gathering gems would cause you to exceed 10 gems. You must have a total of 10 gems after the exchange.'

  public alert: string;

  // Move to alert type enum
  public ALERT_TYPE_NONE = undefined;
  public ALERT_TYPE_SYSTEM_ERROR = 'System Error'
  public ALERT_TYPE_USER_ERROR = 'Invalid Play'
  public ALERT_TYPE_VICTORY = 'Victory!'
  public ALERT_TYPE_NOBLE = 'Noble Impressed!'
  public ALERT_TYPE_RESERVE = 'Reserve A Card'
  public ALERT_TYPE_EXCHANGE = 'Exchange Gems'

  public alertType: string;

  // Move to enum (turn actions)    Buy/Reserve Card or Gather Gems
  public ACTION_NONE = 'No Action'
  public ACTION_GATHER_GEMS = 'Gather Gems'
  public ACTION_EXCHANGE_GEMS = 'Exchange Gems'
  public ACTION_BUY_CARD = 'Buy Card'
  public ACTION_RESERVE_CARD = 'Reserve Card'

  public turnAction: string;
  private activePlayer: number;
  public showBuyingPowerAsTotal: boolean = true

  public gatheredGems: GemType[];
  public exchangingGems: GemType[];
  public buyingCard: Card;
  private buyingCardIndex: number;
  public reservingCard: Card;
  private reservingCardIndex: number;
  public reservingCardTemp: Card;
  private reservingCardIndexTemp: number;

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

  public showAsSelected(obj: Card | GemType) {
    if (this.instanceOfGemType(obj)) {
      if (this.gatheredGems && this.gatheredGems.includes(obj))
        if (this.gatheredGems.length == 2 && this.gatheredGems[0] == this.gatheredGems[1])
          return { 'box-shadow': '0 4px 8px 0 rgba(255, 165, 0, 0.8), 0 6px 20px 0 rgba(255, 165, 0, 0.8)' }
        else
          return { 'box-shadow': '0 4px 8px 0 rgba(255, 255, 0, 0.8), 0 6px 20px 0 rgba(255, 255, 0, 0.8)' }
    } else {
      if (this.turnAction == this.ACTION_BUY_CARD && this.buyingCard && this.buyingCard == obj)
        return { 'box-shadow': '0 4px 8px 0 rgba(255, 0, 0, 0.8), 0 6px 20px 0 rgba(255, 0, 0, 0.8)' }
      else if (this.turnAction == this.ACTION_RESERVE_CARD && this.reservingCard && this.reservingCard == obj)
        return { 'box-shadow': '0 4px 8px 0 rgba(0, 0, 255, 0.8), 0 6px 20px 0 rgba(0, 0, 255, 0.8)' }
    }
  }

  private instanceOfGemType(obj: any): obj is GemType {
    return Object.values(GemType).includes(obj)
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
        // don't show modal here since it would be recursive
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
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  public getTierCardColor(card: Card) {
    switch (card.tier) {
      case 1: {
        return 'bg-primary'
      }
      case 2: {
        return 'bg-warning'
      }
      case 3: {
        return 'bg-success'
      }
      default: {
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  public getTierCardImage(tier: number) {
    switch (tier) {
      case 1: {
        return "../../../assets/t1gem.png"
      }
      case 2: {
        return "../../../assets/t2gems.svg"
      }
      case 3: {
        return "../../../assets/t3gems.png"
      }
      default: {
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  private startNewTurn(): void {
    console.log('startNewTurn')
    console.log('player', this.gameService.getPlayers()[this.activePlayer])
    // establish turn variables
    this.turnAction = this.ACTION_NONE
    this.gatheredGems = []
    this.exchangingGems = []
    this.buyingCard = undefined
    this.reservingCard = undefined
  }

  private endTurn(): void {
    console.log('endTurn')

    // validate turn action
    if (this.validateTurnAction()) {
      this.implementTurnAction()
      this.checkIfPlayerEarnedNoble()
      if (this.gameService.getPlayers()[this.activePlayer].points >= 25) {
        this.showGempyreModal(this.ALERT_TYPE_VICTORY, this.gameService.getPlayers()[this.activePlayer].name + this.ALERT_VICTORY + ' (A new game will start automatically for now.)')
        this.gameService.buildGame()
      }
      this.startNewTurn()
    } else {
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.alert);
    }
  }

  private validateTurnAction(): boolean {
    console.log('validateTurnAction:', this.turnAction)

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

        if (this.gatheredGems.length == 3 || this.gatheredGems[0] == this.gatheredGems[1]) {
          if (this.getPlayerGemsTotal() + this.gatheredGems.length <= 3) {
            return true
          } else {
            this.alert = this.ALERT_MAX_GEMS
            return false
          }
        }
        else {
          this.alert = this.ALERT_INVALID_GEM_SELECTION
          return false
        }
      }
      case this.ACTION_EXCHANGE_GEMS: {
        if (this.gatheredGems.length < 2) {
          this.alert = this.ALERT_INVALID_GEM_SELECTION
          return false
        }

        if (this.gatheredGems.length == 3 || this.gatheredGems[0] == this.gatheredGems[1]) {
          if (this.getPlayerGemsTotal() + this.gatheredGems.length == 3) {
            return true
          } else {
            this.alert = this.ALERT_EXCHANGE_CRITERIA_NOT_MET
            return false
          }
        }
        else {
          this.alert = this.ALERT_INVALID_GEM_SELECTION
          return false
        }
      }
      case this.ACTION_BUY_CARD: {
        if (this.buyingCard)
          return true
        else
          return false
      }
      case this.ACTION_RESERVE_CARD: {
        if (this.reservingCard && this.reservingCardIndex != NaN)
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
    console.log('implementTurnAction:', this.turnAction)

    let oldPlayerTokens = new Map<GemType, number>();
    this.gameService.getPlayers()[this.activePlayer].gems.forEach((count, type) => { oldPlayerTokens.set(type, count) })

    switch (this.turnAction) {
      case this.ACTION_GATHER_GEMS: {
        for (let gem of this.gatheredGems) {
          this.updateBankTokens(gem, -1)
          this.updatePlayerTokens(gem, 1)
        }
        this.updatePlayerBuyingPower(oldPlayerTokens)
        break;
      }
      case this.ACTION_EXCHANGE_GEMS: {
        for (let gem of this.gatheredGems) {
          this.updateBankTokens(gem, -1)
          this.updatePlayerTokens(gem, 1)
        }
        for (let gem of this.exchangingGems) {
          this.updateBankTokens(gem, 1)
        }
        this.updatePlayerBuyingPower(oldPlayerTokens)
        break;
      }
      case this.ACTION_BUY_CARD: {
        console.log('buycard', this.buyingCard)
        console.log('buyindex', this.buyingCardIndex)
        // do not update shown cards if buying a reserved card
        if (this.buyingCardIndex != undefined) {
          // update shown cards
          this.finalizeCollectingCard()
        } else {
          // remove buyingCard from player.heldCards
          console.log('remove held card')
          this.gameService.getPlayers()[this.activePlayer].heldCards.splice(this.gameService.getPlayers()[this.activePlayer].heldCards.findIndex((card) => { return card == this.buyingCard }), 1)
        }
        // update player and bank gems
        for (let gem of this.buyingCard.cost.entries()) {
          let playerCards = this.getPlayerBuyingPowerByGemType(gem[0]) - oldPlayerTokens.get(gem[0])
          let tokensBeingUsed = gem[1] - playerCards
          console.log('tokensBeingUsed - GemType', gem[0], '- count', tokensBeingUsed)
          if (tokensBeingUsed && tokensBeingUsed > 0) {
            this.updateBankTokens(gem[0], tokensBeingUsed)
            this.updatePlayerTokens(gem[0], -tokensBeingUsed)
          }
        }
        this.updatePlayerBuyingPower(oldPlayerTokens)
        // update player points for bought card
        this.gameService.getPlayers()[this.activePlayer].points += this.buyingCard.points
        break;
      }
      case this.ACTION_RESERVE_CARD: {
        // update shown cards
        this.finalizeCollectingCard()
        // update player and bank gems - gain a gold for reserving a card
        if (this.gameService.getBankTokens().get(GemType.GOLD) > 0) {
          this.updateBankTokens(GemType.GOLD, -1)
          this.updatePlayerTokens(GemType.GOLD, 1)
        }
        this.gameService.getPlayers()[this.activePlayer].heldCards.push(this.reservingCard)
        this.updatePlayerBuyingPower(oldPlayerTokens)
        break;
      }
      default: {
        this.showGempyreModal(this.ALERT_TYPE_SYSTEM_ERROR, this.ALERT_SYSTEM_ERROR);
        break;
      }
    }
  }

  public finalizeCollectingCard(): void {
    let card = this.turnAction == this.ACTION_BUY_CARD ? this.buyingCard : this.reservingCard
    let cardIndex = this.turnAction == this.ACTION_BUY_CARD ? this.buyingCardIndex : this.reservingCardIndex

    console.log('finalizeCollectingCard:', card)
    if (card) {
      switch (card.tier) {
        case 1: {
          this.gameService.updateShowing(this.gameService.getT1Deck(), this.gameService.getT1Showing(), cardIndex)
          break;
        }
        case 2: {
          this.gameService.updateShowing(this.gameService.getT2Deck(), this.gameService.getT2Showing(), cardIndex)
          break;
        }
        case 3: {
          this.gameService.updateShowing(this.gameService.getT3Deck(), this.gameService.getT3Showing(), cardIndex)
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
    let newValue = this.getPlayerGemsByGemType(gemType) + value
    this.gameService.getPlayers()[this.activePlayer].gems.set(gemType, newValue >= 0 ? newValue : 0)
  }

  private updatePlayerBuyingPower(oldPlayerTokens: Map<GemType, number>): void {
    for (let gem of Object.values(GemType)) {
      let oldTokenValue = oldPlayerTokens.get(gem)
      let newTokenValue = this.getPlayerGemsByGemType(gem)
      let oldCardValue = this.getPlayerBuyingPowerByGemType(gem) - oldTokenValue;
      let newCardValue = this.buyingCard ? (this.buyingCard.value == gem ? 1 : 0) : 0
      let newBuyingPower = oldCardValue + newTokenValue + newCardValue
      this.gameService.getPlayers()[this.activePlayer].buyingPower.set(gem, newBuyingPower)

      // quick bug fix -- card value is being added to bank. remove it here for now
      if (this.turnAction == this.ACTION_BUY_CARD && this.buyingCard.cost.has(gem) && newCardValue && this.buyingCard.value != gem)
        this.gameService.getBankTokens().set(gem, this.gameService.getBankTokens().get(gem) - 1)
    }
  }

  private checkIfPlayerEarnedNoble(): void {
    if (this.gameService.getNobles().length > 0) {
      for (let noble of this.gameService.getNobles()) {
        if (noble) {
          let requirementsMet = true
          for (let cost of noble.cost.entries()) {
            if (!((this.getPlayerBuyingPowerByGemType(cost[0]) - this.getPlayerGemsByGemType(cost[0])) >= cost[1])) {
              requirementsMet = false
              break
            }
          }

          if (requirementsMet) {
            this.gameService.getPlayers()[this.activePlayer].points += 3
            this.gameService.getNobles()[this.gameService.getNobles().findIndex((targetNoble) => { return targetNoble == noble })] = undefined
            this.showGempyreModal(this.ALERT_TYPE_NOBLE, 'Player ' + this.activePlayer + this.ALERT_EARNED_NOBLE)
            break
          }
        }
      }
    }
  }

  public gatherGem(gemType: GemType): void {

    // check that action is available
    if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_GATHER_GEMS && this.turnAction != this.ACTION_EXCHANGE_GEMS) {
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_OVERLAPPING_ACTIONS);
      return
    }

    // check player gem count

    if (gemType != GemType.GOLD) {
      // check that gem is available
      if (!this.gemIsAvailable(gemType)) {
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_GEM_NOT_AVAILABLE);
        return
      }

      if (this.gatheredGems.length < 2) {
        this.gatheredGems.push(gemType)
      } else if (this.gatheredGems.includes(gemType)
        || this.gatheredGems.filter((gem) => { return gem == this.gatheredGems[0] }).length != 1
        || this.gatheredGems.length >= 3) {
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_INVALID_GEM_SELECTION);
      } else {
        this.gatheredGems.push(gemType)
      }
    } else {
      console.log('cannot gather gold')
    }

    if (this.gatheredGems.length > 0 && this.turnAction == this.ACTION_NONE) {
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

  public exchangeGem(gem: GemType): void {
    if (this.exchangingGems.length < this.gatheredGems.length) {
      if (this.getPlayerGemsByGemType(gem) != undefined && this.getPlayerGemsByGemType(gem) > 0) {
        this.exchangingGems.push(gem)
        this.updatePlayerTokens(gem, -1)
        this.gameService.getPlayers()[this.activePlayer].buyingPower.set(gem, this.getPlayerBuyingPowerByGemType(gem) - 1)
      } else {
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_NO_GEM_TO_EXCHANGE)
      }
    } else {
      this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_BAD_EXCHANGE)
    }
  }

  public returnExchangingGem(returnGem: GemType): void {

    this.updatePlayerTokens(returnGem, 1)
    this.gameService.getPlayers()[this.activePlayer].buyingPower.set(returnGem, this.getPlayerBuyingPowerByGemType(returnGem) + 1)

    this.exchangingGems.splice(this.exchangingGems.findIndex((gem) => { return gem == returnGem }), 1)
  }

  public startGemExchange(): void {
    this.turnAction = this.ACTION_EXCHANGE_GEMS
    this.alertType = this.ALERT_TYPE_EXCHANGE
    this.alert = this.ALERT_EXCHANGE
  }

  public buyCard(card: Card, showingIndex?: number): void {
    if (card) {
      // check that action is available
      // if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_BUY_CARD && this.turnAction != this.ACTION_RESERVE_CARD) {     // use this line if we don't want get Overlapping Actions modal between buying and reserving
      if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_BUY_CARD) {
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_OVERLAPPING_ACTIONS);
        return
      }
      this.turnAction = this.ACTION_BUY_CARD
      this.buyingCard = card
      this.buyingCardIndex = showingIndex
    }
  }

  public reserveCard(card: Card, showingIndex: number): void {
    if (card) {
      // check that action is available
      // if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_BUY_CARD && this.turnAction != this.ACTION_RESERVE_CARD) {     // use this line if we don't want get Overlapping Actions modal between buying and reserving
      if (this.turnAction != this.ACTION_NONE && this.turnAction != this.ACTION_RESERVE_CARD) {
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_OVERLAPPING_ACTIONS);
        return
      }

      if (this.gameService.getPlayers()[this.activePlayer].heldCards.length < 3) {

        this.reservingCardTemp = card
        this.reservingCardIndexTemp = showingIndex

        if (!this.reservingCard) {
          this.reservingCard = card
          this.reservingCardIndex = showingIndex
        }

        this.showGempyreModal(this.ALERT_TYPE_RESERVE, this.ALERT_RESERVE_CARD);
      } else
        this.showGempyreModal(this.ALERT_TYPE_USER_ERROR, this.ALERT_CAN_NOT_AFFORD_CARD);
    }
  }

  public updateReservingCard(): void {
    this.turnAction = this.ACTION_RESERVE_CARD

    this.reservingCard = this.reservingCardTemp
    this.reservingCardIndex = this.reservingCardIndexTemp
  }

  public activePlayerCanAffordCard(card: Card): boolean {
    for (let cost of card.cost.entries()) {
      if (this.getPlayerBuyingPowerByGemType(cost[0]) < cost[1]) {
        console.log('player', this.activePlayer, 'can not afford card:', card)
        return false
      }
    }

    return true;
  }

  public returnBuyingCard(): void {
    this.turnAction = this.ACTION_NONE
    this.buyingCard = undefined
    this.buyingCardIndex = undefined
  }

  public returnReservingCard(): void {
    this.turnAction = this.ACTION_NONE
    this.reservingCard = undefined
    this.reservingCardIndex = undefined
  }

  public clearTurnAction(): void {
    switch (this.turnAction) {
      case this.ACTION_GATHER_GEMS: {
        this.gatheredGems = []
        this.turnAction = this.ACTION_NONE
        break;
      }
      case this.ACTION_BUY_CARD: {
        this.returnBuyingCard()
        break
      }
      case this.ACTION_RESERVE_CARD: {
        this.returnReservingCard()
        break
      }
      case this.ACTION_EXCHANGE_GEMS: {
        this.gatheredGems = []
        this.exchangingGems.forEach((gem) => {
          this.updatePlayerTokens(gem, 1)
          this.gameService.getPlayers()[this.activePlayer].buyingPower.set(gem, this.getPlayerBuyingPowerByGemType(gem) + 1)
        })
        this.exchangingGems = []
        this.turnAction = this.ACTION_NONE
        break
      }
      default: {
        this.turnAction = this.ACTION_NONE
        break;
      }
    }
    this.turnAction = this.ACTION_NONE
  }

  public getPlayerCardsByGemType(gem: GemType): number {
    return this.getPlayerBuyingPowerByGemType(gem) - this.getPlayerGemsByGemType(gem)
  }

  public getPlayerGemsByGemType(gem: GemType): number {
    return this.gameService.getPlayers()[this.activePlayer].gems.get(gem)
  }

  public getPlayerBuyingPowerByGemType(gem: GemType): number {
    return this.gameService.getPlayers()[this.activePlayer].buyingPower.get(gem)
  }

  public getPlayerCardsTotal(): number {
    let playerCardCount = 0
    for (let gemType of Object.values(GemType)) {
      playerCardCount += this.getPlayerCardsByGemType(gemType)
    }
    return playerCardCount
  }

  public getPlayerGemsTotal(): number {
    let playerGemCount = 0
    for (let gemType of Object.values(GemType)) {
      playerGemCount += this.getPlayerGemsByGemType(gemType)
    }
    return playerGemCount
  }
}
