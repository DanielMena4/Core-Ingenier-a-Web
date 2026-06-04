import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';
import { Players } from './pages/players/players';
import { AuthGuard } from './guards/auth-guard';
import { Teams } from './pages/teams/teams';
import { Matches } from './pages/matches/matches';
import { Lineups } from './pages/lineups/lineups';
import { LineupDetails } from './pages/lineup-details/lineup-details';
import { Stats } from './pages/stats/stats';
import { AdminGuard } from './guards/admin-guard';
import { PlayerDashboard } from './pages/player-dashboard/player-dashboard';

export const routes: Routes = [

    { path: '', component: Login },

    { path: 'register', component: Register },

    { path: 'home', component: Home, canActivate: [AuthGuard] },

    {
        path: 'players',
        component: Players,
        canActivate: [AuthGuard]
    },

    {
        path: 'teams',
        component: Teams,
        canActivate: [AuthGuard, AdminGuard]
    },

    {
        path: 'matches',
        component: Matches,
        canActivate: [AuthGuard, AdminGuard]
    },

    {
        path: 'stats',
        component: Stats,
        canActivate: [AuthGuard, AdminGuard]
    },

    {
        path: 'lineups',
        component: Lineups,
        canActivate: [AuthGuard]
    },

    {
    path: 'lineups/:id',
    component: LineupDetails,
    canActivate: [AuthGuard]
},

    {
        path: 'player-dashboard',
        component: PlayerDashboard,
        canActivate: [AuthGuard]
    },
    {
        path: 'player-dashboard/:id',
        component: PlayerDashboard,
        canActivate: [AuthGuard]
    },
    {
        path: 'matches/:id',
        loadComponent: () =>
            import('./pages/match-detail/match-detail')
                .then(m => m.MatchDetail),
        canActivate: [AuthGuard]
    },

    {
        path: '**',
        redirectTo: 'home'
    }
];