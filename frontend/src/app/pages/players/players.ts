import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './players.html'
})
export class Players implements OnInit {

  players: any[] = [];
  favorites: number[] = [];
  teams: any[] = [];

  newPlayer = {
    name: '',
    team_id: null,
    position: '',
    age: null
  };
  positions = [
    'PG',
    'SG',
    'SF',
    'PF',
    'C'
  ];

  constructor(private playerService: PlayerService,
    private cdr: ChangeDetectorRef,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
    this.loadTeams();
  }

  loadPlayers() {
    this.playerService.getPlayers().subscribe(data => {
      this.players = data;
      this.cdr.detectChanges();
    });
  }

  createPlayer() {
    if (!this.newPlayer.name || !this.newPlayer.team_id) return;
    this.playerService.createPlayer(this.newPlayer).subscribe(() => {
      this.newPlayer = {
        name: '',
        team_id: null,
        position: '',
        age: null,
      };
      this.loadPlayers();
    });
  }

  deletePlayer(id: number) {
    this.playerService.deletePlayer(id).subscribe(() => {
      this.loadPlayers();
    });
  }
  editingPlayer: any = null;

  editPlayer(player: any) {
    this.editingPlayer = { ...player };
  }

  updatePlayer() {
    this.playerService.updatePlayer(this.editingPlayer.id, this.editingPlayer)
      .subscribe(() => {
        this.editingPlayer = null;
        this.loadPlayers();
      });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams = data;
      this.cdr.detectChanges();
    });
  }
}