import { Injectable } from '@angular/core';
import { PlatformService } from '@services/platform.service';

@Injectable({
  providedIn: 'root',
})

export class LocalStorageService {
  constructor(private platformService: PlatformService,) { }

  supports_html5_storage(): boolean {
    if (this.platformService.isBrowser) {
      try {
        return window && 'localStorage' in window && window['localStorage'] !== undefined;
      } catch (e) {
        console.warn('Current browser doesn\'t support local storage');
        return false;
      }
    }
    return true
  }

  setItem(key: string, value: string): boolean {
    if (this.platformService.isBrowser && this.supports_html5_storage()) {
      localStorage.setItem(key, value);
      return true;
    }
    return false
  }

  getItem(key: string): string {
    if (this.platformService.isBrowser && this.supports_html5_storage()) {
      return localStorage.getItem(key) || '';
    } else {
      return ''
    }
  }

  removeItem(key: string): boolean {
    if (this.platformService.isBrowser && this.supports_html5_storage()) {
      localStorage.removeItem(key);
      return true;
    } else {
      return false
    }
  }
}
