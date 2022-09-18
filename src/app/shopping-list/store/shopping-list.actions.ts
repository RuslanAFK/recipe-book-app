import { createAction, props } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const addIngredient = createAction(
  '[Shopping List] ADD_INGREDIENT',
  props<{payload: Ingredient}>()
)

export const addIngredients = createAction(
  '[Shopping List] ADD_INGREDIENTS',
  props<{payload: Ingredient[]}>()
)

export const updateIngredient = createAction(
  '[Shopping List] UPDATE_INGREDIENT',
  props<{payload: Ingredient}>()
)

export const deleteIngredient = createAction(
  '[Shopping List] DELETE_INGREDIENT',
)

export const startEdit = createAction(
  '[Shopping List] START_EDIT',
  props<{payload: number}>()
)

export const stopEdit = createAction(
  'STOP_EDIT',
)
