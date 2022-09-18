import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions'

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export const recipeReducer = createReducer(
  initialState,
  on(RecipesActions.setRecipes, (state, {payload}) => ({
    ...state,
    recipes: [...payload]
  })),
  on(RecipesActions.addRecipe, (state, {payload}) => ({
    ...state,
    recipes: [...state.recipes, payload]
  })),
  on(RecipesActions.updateRecipe, (state, {payload}) => {
    const updatedRecipe = {
      ...state.recipes[payload.index],
      ...payload.recipe
    };
    let updatedRecipes = [...state.recipes];
    updatedRecipes[payload.index] = updatedRecipe;
    return {...state, recipes: updatedRecipes}
  }),
  on(RecipesActions.deleteRecipes, (state, {payload}) => ({
    ...state,
    recipes: state.recipes.filter((recipe, index) => index !== payload)
  })),
)
