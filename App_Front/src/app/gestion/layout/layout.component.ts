import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  selector: "app-layout",
  templateUrl: "layout.component.html",
  styleUrls: ["layout.component.scss"],
})
export class LayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);

  @ViewChild("sidebar") sidebar!: MatSidenav;

  isMobile = signal<boolean>(false);

  sidenavMode = computed(() => (this.isMobile() ? "over" : "side"));
  sidenavOpened = computed(() => !this.isMobile());

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });
  }

  navegar() {
    if (this.isMobile()) {
      this.sidebar.close();
    }
  }
}
