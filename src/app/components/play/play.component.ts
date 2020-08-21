import { Component, OnInit } from '@angular/core';
import { GameService } from "../../services/game.service";
import { getCurrencySymbol } from '@angular/common';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

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
      default: {
        console.log('match not found')
        break;
      }
    }
  }
}
