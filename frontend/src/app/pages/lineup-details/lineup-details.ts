import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LineupDetailsService } from '../../services/lineup-details.service';
import { LineupService } from '../../services/lineup.service';
import { PlayerService } from '../../services/player.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineup-details.html'
})
export class LineupDetails implements OnInit {

  lineupDetails: any[] = [];

  lineups: any[] = [];

  players: any[] = [];

  newDetail = {
    lineup_id: null,
    player_id: null
  };

  constructor(
    private lineupDetailsService: LineupDetailsService,
    private lineupService: LineupService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadLineupDetails();

    this.loadLineups();

    this.loadPlayers();
  }

  loadLineupDetails() {

    this.lineupDetailsService.getLineupDetails()
      .subscribe(data => {

        this.lineupDetails = data;

        this.cdr.detectChanges();
      });
  }

  loadLineups() {

    this.lineupService.getLineups()
      .subscribe(data => {

        this.lineups = data;

        this.cdr.detectChanges();
      });
  }

  loadPlayers() {

    this.playerService.getPlayers()
      .subscribe(data => {

        this.players = data;

        this.cdr.detectChanges();
      });
  }

  createDetail() {

    this.lineupDetailsService
      .createLineupDetail(this.newDetail)
      .subscribe(() => {

        this.newDetail = {
          lineup_id: null,
          player_id: null
        };

        this.loadLineupDetails();
      });
  }

  deleteDetail(id: number) {

    this.lineupDetailsService
      .deleteLineupDetail(id)
      .subscribe(() => {

        this.loadLineupDetails();
      });
  }
}