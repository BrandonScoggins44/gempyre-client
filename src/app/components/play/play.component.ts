import { Component, OnInit } from '@angular/core';
import { GameService } from "../../services/game.service";
import { GemType } from 'src/app/enums/gem-type.enum';
import { Card } from 'src/app/interfaces/card';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public gemTypes = Object.keys(GemType)

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
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

  public getGemTypeFromString(gemName: String): GemType {
    return GemType[gemName as GemType]
  }

  public buyCard(card: Card, showingIndex: number): void {
    // let card =  this.gameService.getT1Showing()[showingIndex]
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

  public updateBankTokens(gemType: GemType, value: number): void {
    this.gameService.getBankTokens().set(gemType, this.gameService.getBankTokens().get(gemType) + value)
  }
}
