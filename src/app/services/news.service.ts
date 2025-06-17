import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) { }

  getTrendingNews(query: string): Observable<any[]> {
    const url = `${this.baseUrl}/everything?q=${encodeURIComponent(query)}&sortBy=popularity&language=es&apiKey=${environment.newsApiKey}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.articles || [])
    );
  }
}
