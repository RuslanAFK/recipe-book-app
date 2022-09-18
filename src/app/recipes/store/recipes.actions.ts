import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const setRecipes = createAction(
  '[Recipes] SET_RECIPES',
  props<{payload: Recipe[]}>()
)

export const fetchRecipes = createAction(
  '[Recipes] FETCH_RECIPES',
)

export const addRecipe = createAction(
  '[Recipes] ADD_RECIPE',
  props<{payload: Recipe}>()
)

export const updateRecipe = createAction(
  '[Recipes] UPDATE_RECIPE',
  props<{payload: {recipe: Recipe, index: number}}>()
)

export const deleteRecipes = createAction(
  '[Recipes] DELETE_RECIPE',
  props<{payload: number}>()
)

export const storeRecipes = createAction(
  '[Recipes] STORE_RECIPES',
)

export const fetchFail = createAction(
  '[Recipes] FETCH_FAIL',
)



