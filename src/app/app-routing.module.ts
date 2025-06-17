import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import Components
import { HomeComponent } from './pages/home/home.component';
import { PlannerComponent } from './pages/planner/planner.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news', component: NewsFeedComponent },
  { path: 'planner', component: PlannerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
