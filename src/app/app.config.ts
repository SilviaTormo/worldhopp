import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

/**
 * Home stays eager (it is the site); destination pages are lazy-loaded
 * so the initial bundle keeps its Core Web Vitals budget.
 */
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  {
    path: 'destino/:slug',
    loadComponent: () =>
      import('./pages/destinations/destination-page.component').then(m => m.DestinationPageComponent),
  },
  {
    path: 'agentes',
    loadComponent: () =>
      import('./pages/agentes/agentes.page').then(m => m.AgentesPageComponent),
  },
  { path: '**', redirectTo: '' },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
  ],
};
