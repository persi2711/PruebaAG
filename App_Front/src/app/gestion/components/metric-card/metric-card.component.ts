import { Component, input, OnInit } from "@angular/core";
import { MatCardModule } from "@angular/material/card";

@Component({
  standalone: true,
  imports: [MatCardModule],
  selector: "app-metric-card",
  templateUrl: "metric-card.component.html",
  styleUrls: ["metric-card.component.scss"],
})
export class MetricCardComponent implements OnInit {
  constructor() {}
  title = input.required<string>();
  value = input.required<number>();
  ngOnInit() {}
}
