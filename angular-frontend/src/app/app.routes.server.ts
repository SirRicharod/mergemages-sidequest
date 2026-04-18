import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Avoid prerendering parameterized routes — serve them with client render mode
  { path: 'profile/:id', renderMode: RenderMode.Client },
  { path: 'user/:id', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
