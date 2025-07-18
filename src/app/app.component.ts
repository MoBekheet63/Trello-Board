import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BoardComponent } from './pages/board/board.component';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  protected readonly title = signal('Trello Board');

}
