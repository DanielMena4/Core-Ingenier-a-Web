import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
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
    position: ''
  };

  constructor(private playerService: PlayerService,
    private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef,
    private teamService: TeamService
  ) { }

  ngOnInit(): void {
    this.loadPlayers();
    this.loadFavorites();
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
        position: ''
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

  addFavorite(id: number) {
    this.favoriteService.addFavorite(id).subscribe(() => {
      alert('Agregado a favoritos');
    });
  }
  loadFavorites() {
    this.favoriteService.getFavorites().subscribe(data => {
      this.favorites = data.map((p: any) => p.id);

      this.cdr.detectChanges();
    });
  }

  isFavorite(playerId: number): boolean {
    return this.favorites.includes(playerId);
  }

  toggleFavorite(playerId: number) {

    if (this.isFavorite(playerId)) {
      this.favoriteService.removeFavorite(playerId).subscribe(() => {
        this.favorites = this.favorites.filter(id => id !== playerId);
        this.cdr.detectChanges();
      });

    } else {
      this.favoriteService.addFavorite(playerId).subscribe(() => {
        this.favorites.push(playerId);
        this.cdr.detectChanges();
      });
    }

  }
}