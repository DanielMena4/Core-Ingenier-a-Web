import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';

import { MatchesService } from '../../services/matches.service';
import { StatsService } from '../../services/stats.service';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './match-detail.html'
})
export class MatchDetail implements OnInit {

  loading = true;

  match: any = null;
  stats: any[] = [];
  players: any[] = [];
  filteredPlayers: any[] = [];

  matchId!: number;

  newStat = this.getEmptyStat();

  constructor(
    private route: ActivatedRoute,
    private matchesService: MatchesService,
    private statsService: StatsService,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.matchesService.getMatchById(id).subscribe(data => {
        this.match = data; setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      });
      this.loadAll(Number(id));
      this.playerService.getPlayers().subscribe(data => {
        this.players = data;
        setTimeout(() => {
          this.cdr.detectChanges();
        });
      });
    }
  }

  loadAll(id: number) {

    forkJoin({
      match: this.matchesService.getMatchById(id),
      stats: this.statsService.getStatsByMatch(id),
      players: this.playerService.getPlayers()
    }).subscribe(res => {

      this.match = res.match;
      this.stats = res.stats;
      this.players = res.players;
      
      this.filteredPlayers = this.players.filter(p =>
        p.team_id === this.match.home_team_id ||
        p.team_id === this.match.away_team_id
      );

    });

  }

  checkReady() {
    if (this.match && this.stats && this.players) {
      this.loading = false;
    }
  }

  createStat() {

    const payload = {
      ...this.newStat,
      match_id: this.matchId
    };

    this.statsService.createStat(payload).subscribe(() => {
      this.reloadStats();
      this.newStat = this.getEmptyStat();
    });
  }

  reloadStats() {
    this.statsService.getStatsByMatch(this.matchId).subscribe(data => {
      this.stats = data;
    });
  }

  private getEmptyStat() {
    return {
      player_id: null,

      points: null,
      rebounds: null,
      assists: null,

      minutes: null,
      steals: null,
      blocks: null,
      turnovers: null,
      plus_minus: null,

      field_goals_made: null,
      field_goals_attempted: null,

      threes_made: null,
      threes_attempted: null,

      free_throws_made: null,
      free_throws_attempted: null
    };
  }
}