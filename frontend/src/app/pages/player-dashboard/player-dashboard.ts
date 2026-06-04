import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-dashboard.html'
})
export class PlayerDashboard implements OnInit {

  players: any[] = [];
  playerIdFromRoute: number | null = null;
  selectedPlayerId: number | null = null;

  selectedAnalytics: any = null;

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.playerIdFromRoute =
        Number(id);

      this.selectedPlayerId =
        this.playerIdFromRoute;
    }

    this.loadPlayers();
  }

  loadPlayers() {

    this.playerService.getPlayers().subscribe({

      next: (data) => {

        this.players = data;

        if (this.playerIdFromRoute) {

          this.selectedPlayerId =
            this.playerIdFromRoute;

          this.loadPlayerAnalytics();
        }

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

        const analytics = data?.analytics;
        const impact = data?.impact;
        const player = data?.player;

        this.selectedAnalytics = {
          player,

          stats: analytics?.averages ?? {},

          shooting: analytics?.shooting ?? {},

          efficiency: analytics?.efficiency ?? {},

          styles: analytics?.styles ?? [],

          impact: {
            impact_score: impact?.impact_score ?? 0,
            breakdown: impact?.breakdown ?? {
              percentiles: {},
              shooting: {}
            }
          },

          totals: analytics?.totals ?? {}
        };

        this.cdr.detectChanges();
      }
    });
  }
}