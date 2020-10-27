import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../classes/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private gempyreUserURL: string

  constructor(private http: HttpClient) {
    this.gempyreUserURL = 'https://gempyre-user.herokuapp.com/users'
    // this.gempyreUserURL = 'http://localhost:8080/users'
  }

  public findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.gempyreUserURL)
  }
}
