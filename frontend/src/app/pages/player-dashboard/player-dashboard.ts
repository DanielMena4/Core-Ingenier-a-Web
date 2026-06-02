import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-dashboard.html'
})
export class PlayerDashboard implements OnInit {

  players: any[] = [];
  selectedPlayerId: number | null = null;

  selectedAnalytics: any = null;

  constructor(
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        this.players = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadPlayerAnalytics() {

    if (!this.selectedPlayerId) {
      this.selectedAnalytics = null;
      return;
    }

    this.playerService.getPlayerAnalytics(this.selectedPlayerId).subscribe({
      next: (data) => {

        console.log('ANALYTICS:', data);

        const stats = data?.stats || {};
        const games = data?.games || 1;

        this.selectedAnalytics = {
          player: data?.player || null,

          stats: {
            points: Number(stats.points) / games,
            rebounds: Number(stats.rebounds) / games,
            assists: Number(stats.assists) / games,
            steals: Number(stats.steals) / games,
            blocks: Number(stats.blocks) / games,
            turnovers: Number(stats.turnovers) / games
          },

          impact: {
            impact_score: data?.impact?.impact_score ?? 0,
            breakdown: data?.impact?.breakdown || {}
          },

          styles: data?.styles || { styles: [] }
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.selectedAnalytics = null;
      }
    });
  }
}