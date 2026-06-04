import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';

@Component({
  standalone: true,
  selector: 'app-players',
  imports: [FormsModule, CommonModule],
  templateUrl: './players.html'
})
export class Players implements OnInit {

  players: any[] = [];
  teams: any[] = [];
  groupedPlayers: { [key: string]: any[] } = {};
  editingPlayer: any = null;

  positions: string[] = ['PG', 'SG', 'SF', 'PF', 'C'];

  newPlayer = {
    name: '',
    team_id: null,
    position: '',
    age: null
  };

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
    this.loadTeams();
  }

  loadPlayers() {

    this.playerService.getPlayers().subscribe({

      next: (data) => {

        this.players = data;

        this.groupedPlayers = {};

        data.forEach((player: any) => {

          const teamName =
            player.team_name || 'Sin equipo';

          if (!this.groupedPlayers[teamName]) {

            this.groupedPlayers[teamName] = [];
          }

          this.groupedPlayers[teamName].push(player);
        });

        this.cdr.detectChanges();
      },

      error: (err) =>
        console.error(
          'Error loading players:',
          err
        )
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading teams:', err)
    });
  }

  createPlayer() {
    if (!this.newPlayer.name || !this.newPlayer.team_id) return;

    this.playerService.createPlayer(this.newPlayer).subscribe({
      next: () => {
        this.newPlayer = {
          name: '',
          team_id: null,
          position: '',
          age: null
        };

        this.loadPlayers();
      },
      error: (err) => console.error('Error creating player:', err)
    });
  }

  deletePlayer(id: number) {
    this.playerService.deletePlayer(id).subscribe({
      next: () => this.loadPlayers(),
      error: (err) => console.error('Error deleting player:', err)
    });
  }

  editPlayer(player: any) {
    this.editingPlayer = { ...player };
  }

  updatePlayer() {
    if (!this.editingPlayer) return;

    this.playerService.updatePlayer(
      this.editingPlayer.id,
      this.editingPlayer
    ).subscribe({
      next: () => {
        this.editingPlayer = null;
        this.loadPlayers();
      },
      error: (err) => console.error('Error updating player:', err)
    });
  }
  viewPlayer(playerId: number) {

    this.router.navigate([
      '/player-dashboard',
      playerId
    ]);
  }
}