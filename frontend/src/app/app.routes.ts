import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Home } from './pages/home/home';
import { Players } from './pages/players/players';
import { AuthGuard } from './guards/auth-guard';
import { Favorites } from './pages/favorites/favorites';
import { Teams } from './pages/teams/teams';
import { Matches } from './pages/matches/matches';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'register', component: Register },
    { path: 'home', component: Home, canActivate: [AuthGuard] },
    { path: 'players', component: Players, canActivate: [AuthGuard] },
    { path: 'favorites', component: Favorites, canActivate: [AuthGuard]},
    { path: 'teams', component: Teams, canActivate: [AuthGuard] },
    { path: 'matches', component: Matches, canActivate: [AuthGuard]}
];