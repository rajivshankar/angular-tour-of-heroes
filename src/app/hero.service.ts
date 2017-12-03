import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Hero } from './hero';
// import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api

  constructor (
    private http:  HttpClient,
    private messageService: MessageService) { }

  getHeroes (): Observable<Hero[]> {
    // TODO: Send the message _after_ fetching the heroes
    // this.messageService.add('HeroService: fetched heroes');
    // return of(HEROES);
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
          tap(heroes => this.log("Fetched Heroes")),
          catchError(this.handleError('getHeroes', []))
        );
  }

  getHero (id: number): Observable<Hero> {
    // Todo: send the message _after_ fetching the hero
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe (
      tap(_ => this.log(`Fetched Hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  updateHero (hero:Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`Updated hero id=${hero.id}`)),
      catchError(this.handleError<any>("Update Hero"))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /** POST: add a new hero to the server */
  addHero (hero: Hero) :Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions). pipe(
      tap(_ => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>("addHero"))
    );
  }

  deleteHero (hero: Hero|number) : Observable<Hero> {
    const id = typeof(hero) === 'number' ? hero: hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe (
      tap(_ => this.log(`Deleted Hero id ${id}`)),
      catchError(this.handleError<Hero>("Delete Hero"))
    ); 
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
