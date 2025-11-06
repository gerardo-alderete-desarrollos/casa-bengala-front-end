import { Component, OnInit, HostListener } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.component.html',
  styleUrls: ['./event-info.component.scss'],
  animations: [
    trigger('slideInLeft', [
      state('hidden', style({ opacity: 0, transform: 'translateX(-100px)' })),
      state('visible', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('hidden => visible', animate('800ms ease-out'))
    ])
  ]
})
export class EventInfoComponent implements OnInit {
  infoCards = [
    { icon: '📍', title: 'Ubicación', description: 'Centro de Convenciones Maya', state: 'hidden' },
    { icon: '🎉', title: 'Actividades', description: 'Conferencias, talleres y networking', state: 'hidden' },
    { icon: '🎁', title: 'Beneficios', description: 'Regalos exclusivos y certificados', state: 'hidden' }
  ];

  ngOnInit() {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.checkScroll();
  }

  checkScroll() {
    const element = document.querySelector('.event-info');
    if (element) {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 100;
      
      if (isVisible) {
        this.infoCards.forEach((card, i) => {
          setTimeout(() => {
            card.state = 'visible';
          }, i * 200);
        });
      }
    }
  }
}