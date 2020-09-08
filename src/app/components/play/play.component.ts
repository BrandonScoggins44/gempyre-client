import { Component, OnInit } from '@angular/core';
import { GameService } from "../../services/game.service";
import { GemType } from 'src/app/enums/gem-type.enum';

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
}
