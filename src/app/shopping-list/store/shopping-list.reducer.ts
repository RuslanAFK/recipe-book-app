import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";
import * as shoppingListActions from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editIndex: number | null;
}

const initialState: State = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatos', 8)
  ],
  editIndex: null
}

export const shoppingListReducer = createReducer(
  initialState,
  on(shoppingListActions.addIngredient, (state, {payload: ingredient}) => ({
    ...state,
    ingredients: [...state.ingredients, ingredient]
  })),
  on(shoppingListActions.addIngredients, (state, {payload: ingredients}) => ({
    ...state,
    ingredients: [...state.ingredients, ...ingredients]
  })),
  on(shoppingListActions.updateIngredient, (state, {payload: ingredient}) => {
    if(state.editIndex === null){
      return {...state};
    }
    const oldIngredient = state.ingredients[state.editIndex];
    const updatedIngredient = {
      ...oldIngredient, ...ingredient
    }
    const updatedIngredients = [...state.ingredients];
    updatedIngredients[state.editIndex] = updatedIngredient;
    return ({
    ...state,
    ingredients: updatedIngredients,
    editIndex: null
  })}),
  on(shoppingListActions.deleteIngredient, (state) => ({
    ...state,
    ingredients: state.ingredients.filter((ig, igIndex) => (igIndex !== state.editIndex)),
    editIndex: null
  })),
  on(shoppingListActions.startEdit, (state, {payload: index}) => ({
    ...state,
    editIndex: index,
  })),
  on(shoppingListActions.stopEdit, state => ({
    ...state,
    editIndex: null
  })),
)
