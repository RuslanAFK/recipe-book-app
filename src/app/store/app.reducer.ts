import { ActionReducerMap } from '@ngrx/store';
import * as auth from '../auth/store/auth.reducer';
import * as shoppingList from '../shopping-list/store/shopping-list.reducer';
import * as recipes from '../recipes/store/recipes.reducer';

export interface AppState {
  shoppingList: shoppingList.State;
  auth: auth.State;
  recipes: recipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: shoppingList.shoppingListReducer,
  auth: auth.authReducer,
  recipes: recipes.recipeReducer,
}
