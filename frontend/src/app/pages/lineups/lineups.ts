import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LineupService } from '../../services/lineup.service';
import { TeamService } from '../../services/team.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lineups.html'
})
export class Lineups implements OnInit {

  lineups: any[] = [];
  teams: any[] = [];

  editingLineup: any = null;

  newLineup = {
    name: '',
    team_id: null
  };

  constructor(
    private lineupService: LineupService,
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLineups();
    this.loadTeams();
  }

  loadLineups() {
    this.lineupService.getLineups().subscribe(data => {
      this.lineups = data;
      this.cdr.detectChanges();
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams = data;
      this.cdr.detectChanges();
    });
  }

  createLineup() {

    this.lineupService.createLineup(this.newLineup)
      .subscribe(() => {

        this.newLineup = {
          name: '',
          team_id: null
        };

        this.loadLineups();
      });
  }

  editLineup(lineup: any) {
    this.editingLineup = { ...lineup };
  }

  updateLineup() {

    this.lineupService.updateLineup(
      this.editingLineup.id,
      this.editingLineup
    ).subscribe(() => {

      this.editingLineup = null;

      this.loadLineups();
    });
  }

  deleteLineup(id: number) {

    this.lineupService.deleteLineup(id)
      .subscribe(() => {

        this.loadLineups();
      });
  }
}