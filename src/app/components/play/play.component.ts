import { Component, OnInit } from '@angular/core';
import { GameService } from "../../services/game.service";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

}
