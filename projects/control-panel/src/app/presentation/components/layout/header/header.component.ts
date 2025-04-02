import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { IconComponent } from 'ngx-spad-lib-icons';

import { UserProfileModel } from '@domain/models/user-profile.model';
import { LogoutUseCase } from '@application/usecases';
import { AuthRepository } from '@infrastructure/repositories';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, IconComponent, NgOptimizedImage, NgClass, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isDropdownOpen: boolean = false;
  profile: UserProfileModel | null = null;
  date: string | null = null;
  pictureProfile: string | undefined = undefined;
  imageError: boolean = false;
  userInitial: string = '';

  @ViewChild('logout') logout!: ElementRef<HTMLDialogElement>;

  private readonly elementRef = inject(ElementRef);
  private readonly authRepository = inject(AuthRepository);
  private readonly logoutUseCase = inject(LogoutUseCase);

  ngOnInit(): void {
    this.getProfile();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logOut(confirm?: boolean): void {
    if (!confirm) {
      this.logout?.nativeElement.showModal();
    } else {
      this.logoutUseCase.execute();
    }
  }

  cancelLogOut(): void {
    this.logout?.nativeElement.close();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  async getProfile(): Promise<void> {
    this.profile = this.authRepository.getUserProfile();

    this.pictureProfile = this.profile?.picture;
    this.imageError = false;
    this.setUserInitial();

    this.date = this.profile ? this.profile.getFormattedLastAccessData() : null;
  }

  private setUserInitial(): void {
    if (this.profile?.given_name) {
      this.userInitial = this.profile.given_name.charAt(0).toUpperCase();
    } else if (this.profile?.email) {
      this.userInitial = this.profile.email.charAt(0).toUpperCase();
    } else {
      this.userInitial = '?';
    }
  }

  onImageError(): void {
    this.imageError = true;
    this.pictureProfile = undefined;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isDropdownOpen) this.isDropdownOpen = false;
  }

  ngOnDestroy(): void {
    if (this.pictureProfile?.startsWith('blob:')) {
      URL.revokeObjectURL(this.pictureProfile);
    }
  }
}

