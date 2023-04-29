import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map, tap} from 'rxjs/operators';

import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';
import { Ingredient } from './../shared/ingredient.model';


//we use this to be able to inject a service from a service
@Injectable()
export class RecipeService{

    // recipeSelected = new EventEmitter<Recipe>();
    recipeChanged = new Subject<Recipe[]>();
    recipes : Recipe[];
    //  = [
    //     new Recipe('A Test Recipe',
    //      'This is description', 
    //      'https://assets.bonappetit.com/photos/5d7296eec4af4d0008ad1263/master/pass/Basically-Gojuchang-Chicken-Recipe-Wide.jpg',
    //      [ new Ingredient('Meat', 1), new Ingredient('Tomatoes', 1)]),
    //     new Recipe('A Test Recipe 2', 
    //     'This is description 2',
    //      'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2019/8/6/0/WU2301_Four-Cheese-Pepperoni-Pizzadilla_s4x3.jpg.rend.hgtvcom.826.620.suffix/1565115622965.jpeg',
    //      [ new Ingredient('Egg', 1)])
    //   ];

    constructor(private shoppingListService: ShoppingListService, 
        private httpClient: HttpClient){}


    setRecipes(recipes : Recipe[]){
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes);
    }   

    getRecipes(){
        return this.recipes.slice();
    } 
    
    // getRecipes(){
    //     return this.fetchRecipes();
    // }

    getRecipe(index: number){
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]){
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipes(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index : number){
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }

    //recipes : Recipe[]
    storeRecipes(){
        this.httpClient.put('https://ng-recipe-book-2a330.firebaseio.com/recipes.json', this.recipes).subscribe(
            response => {
                console.log(response);
            }
        )
    }

    fetchRecipes(){
        return this.httpClient.get('https://ng-recipe-book-2a330.firebaseio.com/recipes.json')
        .pipe(map( (recipes: Recipe[]) => {
            return recipes.map( recipe => {
                return {...recipe, ingredients : recipe.ingredients ? recipe.ingredients : []}  
            });
        }),
        tap(
            (response : Recipe[]) => {
                this.setRecipes(response);
            }
        ))
    }
}