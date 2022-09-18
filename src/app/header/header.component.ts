import {Component, OnDestroy, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  isAuthed = false;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('auth')
    .pipe(map(authState => authState.user))
    .subscribe((user) => {
      this.isAuthed = user? true: false;
    });
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSaveData() {
    this.store.dispatch(RecipesActions.storeRecipes());
  }

  onFetchData() {
    this.store.dispatch(RecipesActions.fetchRecipes());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

}
