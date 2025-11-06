import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Registration {
  id?: number;
  name: string;
  email: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private apiUrl = 'https://casa-bengala-back-end.onrender.com/register';
  
  // Subject para notificar cuando hay un nuevo registro
  private registrationCreated$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  getRegistrations(): Observable<Registration[]> {
    return this.http.get<Registration[]>(this.apiUrl);
  }

  createRegistration(registration: Registration): Observable<Registration> {
    return this.http.post<Registration>(this.apiUrl, registration).pipe(
      tap(() => {
        // Notificar que se creó un nuevo registro
        this.registrationCreated$.next();
      })
    );
  }

  // Observable público para que otros componentes se suscriban
  onRegistrationCreated(): Observable<void> {
    return this.registrationCreated$.asObservable();
  }
}