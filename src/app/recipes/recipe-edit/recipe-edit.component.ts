import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router'
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import * as RecipesActions from '../store/recipes.actions';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: any;
  editMode = false;
  recipeForm: any;
  recipeIngr: any = new FormArray([]);
  subscription: Subscription | null = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>,
              ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(params['id']){
        this.editMode = true;
        this.id = +params['id'];
      }else {
        this.editMode = false;
      }
      this.initForm();
    })
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private initForm() {
    if(this.editMode){
      this.subscription = this.store.select('recipes').pipe(map(recipeState => recipeState.recipes.find(
        (recipe, index) => index === this.id
      ))).subscribe(recipe => {
        if(recipe) {
          if(recipe['ingredients']){
            for(let ingr of recipe.ingredients){
              this.recipeIngr.push(
                new FormGroup({
                  'name': new FormControl(ingr.name, [Validators.required]),
                  'amount': new  FormControl(ingr.amount,
                    [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
                })
              )
            }
          }
          this.recipeForm = new FormGroup({
            'name': new FormControl(recipe.name, [Validators.required]),
            'imagePath': new FormControl(recipe.imagePath, [Validators.required]),
            'description': new FormControl(recipe.description, [Validators.required]),
            'ingredients': this.recipeIngr
          });
        }}
      )
    }
    else{
      this.recipeForm = new FormGroup({
        'name': new FormControl('', [Validators.required]),
        'imagePath': new FormControl('', [Validators.required]),
        'description': new FormControl('', [Validators.required]),
        'ingredients': this.recipeIngr
      });
    }

  }

  onSubmit() {
    if(this.editMode){
      this.store.dispatch(RecipesActions.updateRecipe({payload: {recipe: this.recipeForm.value, index: this.id}}));
    }else {
      this.store.dispatch(RecipesActions.addRecipe({payload: this.recipeForm.value}));
    }
    this.onCancel();
  }

  onAddIngr() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, [Validators.required]),
        'amount': new FormControl(null, [Validators.required,Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  deleteIngr(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
