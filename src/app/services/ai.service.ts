import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor(private gameService: GameService) { }

  public test(): void {
    console.log('test')
    console.log('test game data', this.gameService.getBankTokens())
  }
}
