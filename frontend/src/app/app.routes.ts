import { Routes } from '@angular/router';

import { LayoutShellComponent } from './layouts/shell/layout-shell.component';

export const routes: Routes = [
	{
		path: '',
		component: LayoutShellComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'dashboard',
				loadComponent: () =>
					import('./features/dashboard/dashboard.component').then(
						(m) => m.DashboardComponent,
					),
			},
		],
	},
	{ path: '**', redirectTo: 'dashboard' },
];
