import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LineupService } from '../../services/lineup.service';
import { TeamService } from '../../services/team.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './lineups.html'
})
export class Lineups implements OnInit {

  lineups: any[] = [];
  teams: any[] = [];

  editingLineup: any = null;
  selectedLineup: any = null;

  selectedPlayers: any[] = [];
  availablePlayers: any[] = [];

  calculatedLineup: any = null;

  loadingCalculation = false;

  newLineup = {
    name: '',
    team_id: null
  };

  selectedTeamId: number | null = null;
  selectedTeamId2: number | null = null;

  soloModes = ['BALANCED', 'OFFENSIVE', 'DEFENSIVE'];
  vsModes = ['VS_INTERIOR', 'VS_EXTERIOR'];

  selectedMode = 'BALANCED';

  optimizedLineup: any = null;
  loadingLineup = false;

  private request$ = new Subject<void>();

  constructor(
    private lineupService: LineupService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLineups();
    this.loadTeams();
  }

  get availableModes() {
    return this.selectedTeamId2
      ? this.vsModes
      : this.soloModes;
  }

  loadLineups() {
    this.lineupService.getLineups().subscribe({
      next: (data) => {
        this.lineups = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe({
      next: (data) => {
        this.teams = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  createLineup() {
    if (!this.newLineup.name || !this.newLineup.team_id) return;

    this.lineupService.createLineup(this.newLineup).subscribe({
      next: () => {
        this.newLineup = { name: '', team_id: null };
        this.loadLineups();
      },
      error: (err) => console.error(err)
    });
  }

  editLineup(lineup: any) {
    this.editingLineup = { ...lineup };
  }

  updateLineup() {
    if (!this.editingLineup) return;

    this.lineupService
      .updateLineup(this.editingLineup.id, this.editingLineup)
      .subscribe({
        next: () => {
          this.editingLineup = null;
          this.loadLineups();
        },
        error: (err) => console.error(err)
      });
  }

  deleteLineup(id: number) {
    if (!confirm('¿Eliminar este lineup?')) return;

    this.lineupService.deleteLineup(id).subscribe({
      next: () => {
        this.loadLineups();

        if (this.selectedLineup?.id === id) {
          this.selectedLineup = null;
          this.selectedPlayers = [];
          this.availablePlayers = [];
          this.calculatedLineup = null;
        }
      },
      error: (err) => console.error(err)
    });
  }

  onTeamChange() {
    this.selectedMode = 'BALANCED';
    this.generateOptimalLineup();
  }

  onTeam2Change() {
    this.selectedMode = 'VS_INTERIOR';
    this.generateOptimalLineup();
  }

  generateOptimalLineup() {
    if (!this.selectedTeamId) return;

    this.request$.next();
    this.loadingLineup = true;

    this.lineupService
      .getOptimalLineup(this.selectedTeamId, this.selectedMode)
      .pipe(takeUntil(this.request$))
      .subscribe({
        next: (data) => {
          this.optimizedLineup = data;
          this.loadingLineup = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loadingLineup = false;
        }
      });
  }

  selectLineup(lineup: any) {
    this.selectedLineup = lineup;

    this.lineupService.getLineup(lineup.id).subscribe({
      next: (data) => {

        console.log('LINEUP DATA:', data);

        this.selectedPlayers = data.players || [];

        const allTeamPlayers = data.availablePlayers || [];

        const selectedIds = new Set(
          this.selectedPlayers.map((p: any) => p.id ?? p.player_id)
        );

        this.availablePlayers = allTeamPlayers.filter(
          (p: any) => !selectedIds.has(p.id ?? p.player_id)
        );

        this.calculateLineup();
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  calculateLineup() {
    if (!this.selectedLineup) return;

    this.loadingCalculation = true;

    this.lineupService
      .calculateLineup(this.selectedLineup.id)
      .subscribe({
        next: (data) => {
          this.calculatedLineup = data;
          this.loadingCalculation = false;

          console.log(data);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loadingCalculation = false;
        }
      });
  }

  addPlayer(playerId: number) {
    if (!this.selectedLineup) return;

    this.lineupService
      .addPlayer(this.selectedLineup.id, playerId)
      .subscribe({
        next: () => this.selectLineup(this.selectedLineup),
        error: (err) => console.error(err)
      });
  }

  removePlayer(playerId: number) {
    if (!this.selectedLineup) return;

    this.lineupService
      .removePlayer(this.selectedLineup.id, playerId)
      .subscribe({
        next: () => this.selectLineup(this.selectedLineup),
        error: (err) => console.error(err)
      });
  }
}