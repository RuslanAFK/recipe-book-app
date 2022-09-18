import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, map, switchMap, withLatestFrom } from "rxjs";
import { AppState } from "src/app/store/app.reducer";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';

@Injectable()
export class RecipesEffects {
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>,
    ) {}

  fetchRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.fetchRecipes),
    withLatestFrom(this.store.select('auth')),
    switchMap(([data, state]) => {
      return this.http.get<Recipe[]>(
        'https://recipe-book-20a26-default-rtdb.firebaseio.com/recipes.json',
        {
          params: new HttpParams().set('auth', (state.user && state.user.token)? state.user.token: '')
        }
        )
      }),
      map(recipes => recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients? recipe.ingredients: []};
      })
      ),
      map(recipes => RecipesActions.setRecipes({payload: recipes})),
      catchError(() => {
        alert("The database has problems.");
        return EMPTY;
      }),
  ))

  storeRecipes = createEffect(() => this.actions$.pipe(
    ofType(RecipesActions.storeRecipes),
    withLatestFrom(this.store.select('recipes')),
    withLatestFrom(this.store.select('auth')),
    switchMap(([[actionData, recipesState], state]) => {
      if(recipesState.recipes.length === 0){
        alert("Can't put zero records inside database.");
        return EMPTY;
      }
      else return this.http.put(
        'https://recipe-book-20a26-default-rtdb.firebaseio.com/recipes.json',
         recipesState.recipes,
         {
          params: new HttpParams().set('auth', (state.user && state.user.token)? state.user.token: '')
         });
    })
  ), {dispatch: false})
}
