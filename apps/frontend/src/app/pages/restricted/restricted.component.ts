import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpService } from '@services/http.service';

@Component({
  selector: 'app-restricted',
  standalone: true,
  templateUrl: './restricted.component.html',
  styleUrls: ['./restricted.component.scss'],
  imports: [CommonModule]
})
export class RestrictedComponent {
  constructor(private httpService: HttpService,) { }
  cats$ = this.httpService.getCats()


}
