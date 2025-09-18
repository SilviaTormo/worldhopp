import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  slots = [
    { date: '2025-06-18', times: ['10:00', '12:00', '14:00'] },
    { date: '2025-06-19', times: ['09:00', '11:00', '13:00'] }
  ];

  constructor() { }

  ngOnInit() {}

  book(time: string) {
    alert('Seleccionaste ' + time + '. Integrar con Google Calendar aquí.');
  }
}
