import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

export interface LoadingState {
  isBusy: boolean;
  activeRequests: number;
  routeTransitions: number;
  message: string;
  detail: string;
  phase: 'idle' | 'request' | 'route' | 'delay';
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private activeRequests = 0;
  private routeTransitions = 0;
  private phase: LoadingState['phase'] = 'idle';
  private message = 'Loading workspace';
  private detail = 'Keeping the interface in sync';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCountSubject = new BehaviorSubject<number>(0);
  private routeCountSubject = new BehaviorSubject<number>(0);
  private messageSubject = new BehaviorSubject<string>(this.message);
  private detailSubject = new BehaviorSubject<string>(this.detail);
  private phaseSubject = new BehaviorSubject<LoadingState['phase']>(this.phase);

  loading$ = this.loadingSubject.asObservable();
  state$ = combineLatest({
    activeRequests: this.requestCountSubject,
    routeTransitions: this.routeCountSubject,
    message: this.messageSubject,
    detail: this.detailSubject,
    phase: this.phaseSubject,
  }).pipe(
    map(({ activeRequests, routeTransitions, message, detail, phase }): LoadingState => ({
      isBusy: activeRequests > 0 || routeTransitions > 0,
      activeRequests,
      routeTransitions,
      message,
      detail,
      phase,
    })),
    distinctUntilChanged((previous, current) =>
      previous.isBusy === current.isBusy &&
      previous.activeRequests === current.activeRequests &&
      previous.routeTransitions === current.routeTransitions &&
      previous.message === current.message &&
      previous.detail === current.detail &&
      previous.phase === current.phase,
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly message$ = this.messageSubject.asObservable();
  readonly detail$ = this.detailSubject.asObservable();

  beginRequest(message = 'Loading data', detail = 'Fetching the latest information'): void {
    this.activeRequests += 1;
    this.phase = 'request';
    this.updateState(message, detail);
  }

  endRequest(): void {
    this.activeRequests -= 1;
    if (this.activeRequests <= 0) {
      this.activeRequests = 0;
      this.syncState();
      return;
    }

    this.syncState();
  }

  beginRouteTransition(message = 'Loading route', detail = 'Switching views and preparing content'): void {
    this.routeTransitions += 1;
    this.phase = 'route';
    this.updateState(message, detail);
  }

  endRouteTransition(): void {
    this.routeTransitions -= 1;
    if (this.routeTransitions <= 0) {
      this.routeTransitions = 0;
      this.syncState();
      return;
    }

    this.syncState();
  }

  trackRequest(message?: string, detail?: string): void {
    this.beginRequest(message, detail);
  }

  clear(): void {
    this.activeRequests = 0;
    this.routeTransitions = 0;
    this.phase = 'idle';
    this.updateState('Loading workspace', 'Keeping the interface in sync');
  }

  private updateState(message: string, detail: string): void {
    this.message = message;
    this.detail = detail;
    this.loadingSubject.next(this.activeRequests > 0 || this.routeTransitions > 0);
    this.requestCountSubject.next(this.activeRequests);
    this.routeCountSubject.next(this.routeTransitions);
    this.messageSubject.next(this.message);
    this.detailSubject.next(this.detail);
    this.phaseSubject.next(this.phase);
  }

  private syncState(): void {
    if (this.activeRequests <= 0 && this.routeTransitions <= 0) {
      this.phase = 'idle';
      this.message = 'Loading workspace';
      this.detail = 'Keeping the interface in sync';
    }

    this.loadingSubject.next(this.activeRequests > 0 || this.routeTransitions > 0);
    this.requestCountSubject.next(this.activeRequests);
    this.routeCountSubject.next(this.routeTransitions);
    this.messageSubject.next(this.message);
    this.detailSubject.next(this.detail);
    this.phaseSubject.next(this.phase);
  }
}
