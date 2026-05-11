import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StatsService } from '../../services/stats.service';
import { PlayerService } from '../../services/player.service';
import { MatchesService } from '../../services/matches.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.html'
})
export class Stats implements OnInit {

  stats: any[] = [];

  players: any[] = [];

  matches: any[] = [];

  editingStat: any = null;

  newStat: any = {

    player_id: null,
    match_id: null,

    points: 0,
    rebounds: 0,
    assists: 0,
    steals: 0,
    blocks: 0

  };

  constructor(
    private statsService: StatsService,
    private playerService: PlayerService,
    private matchesService: MatchesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.loadStats();

    this.loadPlayers();

    this.loadMatches();
  }

  loadStats() {

    this.statsService.getStats()
      .subscribe(data => {

        this.stats = data;

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

  loadMatches() {

    this.matchesService.getMatches()
      .subscribe(data => {

        this.matches = data;

        this.cdr.detectChanges();
      });
  }

  createStat() {

    this.statsService.createStat(this.newStat)
      .subscribe(() => {

        this.newStat = {

          player_id: null,
          match_id: null,

          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0
        };

        this.loadStats();
      });
  }

  editStat(stat: any) {

    this.editingStat = { ...stat };
  }

  updateStat() {

    this.statsService
      .updateStat(this.editingStat.id, this.editingStat)
      .subscribe(() => {

        this.editingStat = null;

        this.loadStats();
      });
  }

  deleteStat(id: number) {

    this.statsService.deleteStat(id)
      .subscribe(() => {

        this.loadStats();
      });
  }
}