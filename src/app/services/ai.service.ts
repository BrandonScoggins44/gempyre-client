import { getModuleFactory, Injectable } from '@angular/core';
import { PlayComponent } from '../components/play/play.component';
import { GemType } from '../enums/gem-type.enum';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private gameService: GameService, private playComponent: PlayComponent) { }

  public async processAiTurn(): Promise<void> {
    console.log('processAiTurn')
    await this.delay()
    if (this.playComponent.getPlayerBuyingPowerTotal(this.playComponent.activePlayer) > 2) {
      console.log('thinking of buying a card..')
      let buyCard = undefined
      let buyIndex = undefined
      let showingCards = this.gameService.getT1Showing().concat(this.gameService.getT2Showing().concat(this.gameService.getT3Showing()))
      for (let i = 0; i < showingCards.length; i++) {
        if (showingCards[i] != undefined && this.playComponent.activePlayerCanAffordCard(showingCards[i])) {
          console.log('can buy', showingCards[i])
          buyCard = showingCards[i]
          buyIndex = i
          while (buyIndex > 3) {
            buyIndex -= 4
          }
          break
        }
      }
      if (buyCard && buyIndex != undefined) {
        console.log('buying card..')
        this.playComponent.buyCard(buyCard, buyIndex)
        await this.delay()
        return
      }
    }
    console.log('did not buy a card..')

    // count gems and gem types available in bank
    let bankGemCount = 0
    let bankGemTypesCount = 0
    let bankGemTypesWithFourAvailable: GemType[] = []
    this.gameService.getBankTokens().forEach((value, gemType) => {
      if (value > 0 && gemType != GemType.GOLD) {
        bankGemTypesCount += 1
        bankGemCount += value
        if (value >= 4) {
          bankGemTypesWithFourAvailable.push(gemType)
        }
      }
    })

    // gather 3 gems
    let gemsToGather = []
    console.log('gathering gems..')
    if (this.playComponent.getPlayerGemsTotal(this.playComponent.activePlayer) < 8 && bankGemTypesCount >= 3) {
      console.log('gathering 3 gems..')
      let count = 1
      while (gemsToGather.length < 3) {
        for (let gem of Object.values(GemType).slice(0, Object.values(GemType).length - 1)) {
          if (this.playComponent.getPlayerBuyingPowerByGemType(this.playComponent.activePlayer, gem) < count && this.playComponent.gemIsAvailable(gem) && !gemsToGather.includes(gem)) {
            gemsToGather.push(gem)
            count--
            break
          }
        }
        count++
      }
      await this.gatherGems(gemsToGather)
      return
    }

    // gather 2 gems
    if (this.playComponent.getPlayerGemsTotal(this.playComponent.activePlayer) == 8 && bankGemTypesWithFourAvailable.length > 0) {
      console.log('gathering 2 gems..')
      let count = 1
      while (gemsToGather.length < 1) {
        for (let gem of bankGemTypesWithFourAvailable) {
          if (this.playComponent.getPlayerBuyingPowerByGemType(this.playComponent.activePlayer, gem) < count) {
            gemsToGather.push(gem)
            gemsToGather.push(gem)
            break
          }
        }
        count++
      }
      await this.gatherGems(gemsToGather)
      return
    }

    // exchange gems
    // pick gems to exchange
    console.log('exchanging gems')
    let gemsToExchange = []
    let count = 1
    while (gemsToExchange.length < 3 - (10 - (this.playComponent.getPlayerGemsTotal(this.playComponent.activePlayer)))) {
      for (let gem of Object.values(GemType).slice(0, Object.values(GemType).length - 1)) {
        if (this.playComponent.getPlayerGemsByGemType(this.playComponent.activePlayer, gem) != 0 && this.playComponent.getPlayerGemsByGemType(this.playComponent.activePlayer, gem) < count && !gemsToExchange.includes(gem)) {
          gemsToExchange.push(gem)
          count--
          break
        }
      }
      count++
    }

    count = 1
    for (let gem of Object.values(GemType).slice(0, Object.values(GemType).length - 1)) {
      if (this.playComponent.getPlayerBuyingPowerByGemType(this.playComponent.activePlayer, gem) > count)
        count = this.playComponent.getPlayerBuyingPowerByGemType(this.playComponent.activePlayer, gem)
    }
    count--
    while (gemsToGather.length < 3) {
      for (let gem of Object.values(GemType).slice(0, Object.values(GemType).length - 1)) {
        if (this.playComponent.getPlayerBuyingPowerByGemType(this.playComponent.activePlayer, gem) > count && this.playComponent.gemIsAvailable(gem) && !gemsToGather.includes(gem)) {
          gemsToGather.push(gem)
          count++
          break
        }
      }
      count--
    }
    await this.playComponent.startGemExchange()
    await this.gatherGems(gemsToGather)
    await this.exchangeGems(gemsToExchange)

    // worry about reserving cards later
  }

  private async gatherGems(gemsToGather: GemType[]): Promise<void> {
    console.log('gathering gems..', gemsToGather)
    for (let gem of gemsToGather) {
      console.log('gathering', gem)
      this.playComponent.gatherGem(gem)
      console.log('selected', gem)
      await this.delay()
    }
  }

  private async exchangeGems(gemsToExchange: GemType[]): Promise<void> {
    console.log('exchanging gems..', gemsToExchange)
    for (let gem of gemsToExchange) {
      console.log('adding to exchange', gem)
      await this.playComponent.exchangeGem(gem)
      console.log('added', gem)
      await this.delay()
    }
  }

  private delay() {
    console.log('thinking')
    return new Promise((resolve) => setTimeout(() => { resolve() }, 2000))
  }
}
