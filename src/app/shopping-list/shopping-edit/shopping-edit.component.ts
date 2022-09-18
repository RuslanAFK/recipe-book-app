import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  subscription: any;
  editMode = false;
  editedItem: any;

  @ViewChild('f') form: any;

  constructor(private store: Store<AppState>) { }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
      this.store.dispatch(ShoppingListActions.stopEdit());
    }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editIndex !== null){
        this.editMode = true;
        this.editedItem = stateData.ingredients[stateData.editIndex];
        (<NgForm>this.form).setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount,
        })
      } else {
        this.editMode = false
      }
    });
  }

  onSubmit(form: NgForm){
    const values = form.value;
    const newIngredient = new Ingredient(values.name, values.amount);
    if(this.editMode){
      this.store.dispatch(ShoppingListActions.updateIngredient({payload: newIngredient}));
    }
    else{
      this.store.dispatch(ShoppingListActions.addIngredient({payload: newIngredient}));
    }
    this.editMode = false;
    form.reset();
  }

  onDeleteClicked(){
    this.store.dispatch(ShoppingListActions.deleteIngredient());
    this.onClearClicked();
  }

  onClearClicked(){
    this.editMode = false;
    this.form.reset();
    this.store.dispatch(ShoppingListActions.stopEdit());
  }
}
