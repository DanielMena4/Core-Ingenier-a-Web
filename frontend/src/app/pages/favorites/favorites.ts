import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html'
})
export class Favorites implements OnInit {

  favorites: any[] = [];

  constructor(private favoriteService: FavoriteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe(data => {
      this.favorites = data;
      this.cdr.detectChanges();
    });
  }

  remove(playerId: number) {
    this.favoriteService.removeFavorite(playerId).subscribe(() => {
      this.loadFavorites();
    });
  }
}