import { Routes } from '@angular/router';

import { LayoutShellComponent } from './layouts/shell/layout-shell.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadComponent: () =>
					import('./features/auth/login/login.component').then((m) => m.LoginComponent),
			},
		],
	},
	{
		path: '',
		component: LayoutShellComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{
				path: 'dashboard/admin',
				canActivate: [roleGuard],
				data: { roles: ['admin'] },
				loadComponent: () =>
					import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(
						(m) => m.AdminDashboardComponent,
					),
			},
			{
				path: 'dashboard/user',
				canActivate: [roleGuard],
				data: { roles: ['user'] },
				loadComponent: () =>
					import('./features/dashboard/user-dashboard/user-dashboard.component').then(
						(m) => m.UserDashboardComponent,
					),
			},
			{
				path: 'dashboard',
				loadComponent: () =>
					import('./features/dashboard/dashboard-redirect/dashboard-redirect.component').then(
						(m) => m.DashboardRedirectComponent,
					),
			},
		],
	},
	{ path: '**', redirectTo: 'dashboard' },
];
