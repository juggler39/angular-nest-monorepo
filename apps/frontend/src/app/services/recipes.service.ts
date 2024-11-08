import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe.model';
import { environment } from '../../environments/environments';
const API_PATH = environment.apiPath


@Injectable({
  providedIn: 'root'
})

export class RecipesService {
  recipes$ = this.http.get<Recipe[]>(`${API_PATH}/recipes`);
  constructor(private http: HttpClient) { }
}
