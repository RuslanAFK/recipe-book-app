import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, Observable, of, take, tap } from "rxjs";
import { AppState } from "../store/app.reducer";
import { Recipe } from "./recipe.model";
import * as RecipesActions from "./store/recipes.actions";


@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {

      return this.store.select('recipes').pipe(
      map(recipesState => recipesState.recipes),
      take(1),
      tap((recipes) => {
        if(recipes.length === 0) {
          this.store.dispatch(RecipesActions.fetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.setRecipes),
          );
        }
        return of(recipes);
      })
    )
  }

}
