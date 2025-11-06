import { Component, OnInit, HostListener } from '@angular/core';
import { RegistrationService, Registration } from 'src/app/services/registration.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-registrations-list',
  templateUrl: './registrations-list.component.html',
  styleUrls: ['./registrations-list.component.scss'],
  animations: [
    trigger('fadeInUp', [
      state('hidden', style({ opacity: 0, transform: 'translateY(50px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('hidden => visible', animate('600ms ease-out'))
    ])
  ]
})
export class RegistrationsListComponent implements OnInit {
  registrations: Registration[] = [];
  isLoading = true;
  hasError = false;
  animationState = 'hidden';

  constructor(private registrationService: RegistrationService) {}

  ngOnInit() {
    this.loadRegistrations();
    this.checkScroll();
  }

  loadRegistrations() {
    this.isLoading = true;
    this.hasError = false;
    
    this.registrationService.getRegistrations().subscribe({
      next: (data) => {
        this.registrations = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar registros:', error);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.checkScroll();
  }

  checkScroll() {
    const element = document.querySelector('.registrations-list');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      
      if (isVisible) {
        this.animationState = 'visible';
      }
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getRandomColor(index: number): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    return colors[index % colors.length];
  }
}