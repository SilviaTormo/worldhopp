import { Component, OnInit } from '@angular/core';
import { NewsService } from '../../services/news.service';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.css']
})
export class NewsFeedComponent implements OnInit {
  articles: any[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit() {
    this.loadNews('musica');
  }

  loadNews(query: string) {
    this.newsService.getTrendingNews(query).subscribe(data => {
      this.articles = data;
    });
  }
}
