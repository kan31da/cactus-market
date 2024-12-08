import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorMsgService {
    private apiErrors$$ = new BehaviorSubject(null);

    public apiError$ = this.apiErrors$$.asObservable();

    constructor() { }

    setError(error: any): void {
        this.apiErrors$$.next(error);
    }
}
