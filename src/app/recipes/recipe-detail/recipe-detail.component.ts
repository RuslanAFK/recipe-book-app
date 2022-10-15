import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs';
import { deleteRecipes } from '../store/recipes.actions';
import { addIngredients } from 'src/app/shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: any;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(recipesState => recipesState.recipes.find((recipe, index) => index === this.id))
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }


  onAddToShoppingList() {
    this.store.dispatch(addIngredients({ payload: this.recipe.ingredients }));
  }

  onDeleteRecipe() {
    this.store.dispatch(deleteRecipes({ payload: this.id }));
    this.router.navigate(['/recipes']);
  }
}
