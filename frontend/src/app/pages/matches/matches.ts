import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatchesService } from '../../services/matches.service';
import { TeamService } from '../../services/team.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './matches.html'
})
export class Matches implements OnInit {

  matches: any[] = [];
  editingMatch: any = null;
  teams: any[] = [];

  newMatch = {
    home_team_id: null,
    away_team_id: null,
    match_date: ''
  };

  constructor(
    private matchesService: MatchesService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMatches();
    this.loadTeams();
  }

  loadMatches() {
    this.matchesService.getMatches().subscribe(data => {
      this.matches = data;
      this.cdr.detectChanges();
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams = data;
      this.cdr.detectChanges();
    });
  }

  createMatch() {
    if (!this.newMatch.home_team_id || !this.newMatch.away_team_id) return;
    if (this.newMatch.home_team_id === this.newMatch.away_team_id) {
      alert('No pueden ser el mismo equipo');
      return;
    }
    this.matchesService.createMatch(this.newMatch).subscribe(() => {
      this.newMatch = {
        home_team_id: null,
        away_team_id: null,
        match_date: ''
      };
      this.loadMatches();
    });
  }

  editMatch(match: any) {
    this.editingMatch = { ...match };
  }

  updateMatch() {
    this.matchesService.updateMatch(this.editingMatch.id, this.editingMatch)
      .subscribe(() => {
        this.editingMatch = null;
        this.loadMatches();
      });
  }

  deleteMatch(id: number) {
    this.matchesService.deleteMatch(id).subscribe(() => {
      this.loadMatches();
    });
  }
}