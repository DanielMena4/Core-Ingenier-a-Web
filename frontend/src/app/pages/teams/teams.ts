import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './teams.html'
})
export class Teams implements OnInit {

  teams: any[] = [];

  newTeam = {
    name: '',
    city: ''
  };

  editingTeam: any = null;

  constructor(
    private teamService: TeamService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getTeams().subscribe(data => {
      this.teams = data;
      this.cdr.detectChanges();
    });
  }

  createTeam() {
    if (!this.newTeam.name || !this.newTeam.city) return;

    this.teamService.createTeam(this.newTeam).subscribe({
      next: (res) => {
        this.newTeam = { name: '', city: '' };
        this.loadTeams();
      },
      error: (err) => {
        console.error('ERROR:', err);
      }
    });
  }

  deleteTeam(id: number) {
    this.teamService.deleteTeam(id).subscribe(() => {
      this.loadTeams();
    });
  }

  editTeam(team: any) {
    this.editingTeam = { ...team };
  }

  updateTeam() {
    this.teamService.updateTeam(this.editingTeam.id, this.editingTeam)
      .subscribe(() => {
        this.editingTeam = null;
        this.loadTeams();
      });
  }
}