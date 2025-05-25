import { Component } from '@angular/core';
import { Reading } from '../../models/reading.model';
import { ReadingService } from '../../services/reading-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
})
export class DashboardComponent {

  readings: Reading[] = [];

  // Arrays para gráficos ou histórico
  temperatures: { temperature: number, timestamp: string }[] = [];
  pressures: { pressure: number, timestamp: string }[] = [];
  humidities: { humidity: number, timestamp: string }[] = [];

  // Valores calculados para os cards
  temperaturaMedia: number = 0;
  temperaturaMinima: number = 0;
  temperaturaMaxima: number = 0;

  pressaoMedia: number = 0;
  pressaoMinima: number = 0;
  pressaoMaxima: number = 0;

  umidadeMedia: number = 0;
  umidadeMinima: number = 0;
  umidadeMaxima: number = 0;

  constructor(private readingService: ReadingService) { }

  async ngOnInit(): Promise<void> {
    await this.getReadingValues();
  }

  private async getReadingValues() {
    this.readingService.getAll().subscribe({
      next: (response) => {
        this.readings = response;
        this.separarLeituras();
        this.calcularValoresDosCards();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private separarLeituras() {
    this.temperatures = this.readings.map(r => ({
      temperature: r.temperature,
      timestamp: r.timestamp
    }));
    this.pressures = this.readings.map(r => ({
      pressure: r.pressure,
      timestamp: r.timestamp
    }));
    this.humidities = this.readings.map(r => ({
      humidity: r.humidity,
      timestamp: r.timestamp
    }));
  }

  private calcularValoresDosCards() {
    const temperaturas = this.temperatures.map(t => t.temperature);
    const pressoes = this.pressures.map(p => p.pressure);
    const umidades = this.humidities.map(h => h.humidity);

    this.temperaturaMedia = this.media(temperaturas);
    this.temperaturaMinima = Math.min(...temperaturas);
    this.temperaturaMaxima = Math.max(...temperaturas);

    this.pressaoMedia = this.media(pressoes);
    this.pressaoMinima = Math.min(...pressoes);
    this.pressaoMaxima = Math.max(...pressoes);

    this.umidadeMedia = this.media(umidades);
    this.umidadeMinima = Math.min(...umidades);
    this.umidadeMaxima = Math.max(...umidades);
  }

  private media(valores: number[]): number {
    if (valores.length === 0) return 0;
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return parseFloat((soma / valores.length).toFixed(2));
  }
}
