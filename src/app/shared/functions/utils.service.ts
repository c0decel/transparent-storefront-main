import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { FetchProductDataService } from '../../services/fetch-product-data.service';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  products: Product[]=[];

  reactionData: 'Like' | 'Dislike' | 'Userful' | 'Funny' | 'Dumb' | ''='';

  constructor(
    public router: Router,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public fetchProductData: FetchProductDataService
  ) { }

   /**
   * Get icon by reaction type
   * @param type type of reaction
   * @returns corresponding icon
   */
   getIconByType(type: string): string {
    let icon: string;

    switch (type) {
        case 'Like':
            icon = 'like_icon';
            break;
        case 'Dislike':
            icon = 'dislike_icon';
            break;
        case 'Useful':
            icon = 'useful_icon';
            break;
        case 'Funny':
            icon = 'funny_icon';
            break;
        case 'Dumb':
            icon = 'dumb_icon';
            break;
        default:
            icon = 'like_icon'; 
            break;
      }
      return icon;
  }


  /**
   * Register custom icons
   */
  registerIcons(): void {
    this.iconRegistry.addSvgIcon(
      'like_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/like.svg')
    );
    this.iconRegistry.addSvgIcon(
      'dislike_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/dislike.svg')
    );
    this.iconRegistry.addSvgIcon(
      'useful_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/useful.svg')
    );
    this.iconRegistry.addSvgIcon(
      'funny_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/funny.svg')
    );
    this.iconRegistry.addSvgIcon(
      'dumb_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/dumb.svg')
    )
  }

  /**
   * Go to admin panel
   */
  goToAdminPanel(): void {
    this.router.navigate(['admin-panel']);
  }

  /**
   * Open user profile
   * @param userId user ID
   */
  openProfile(userId: string): void {
    this.router.navigate(['/profile', userId], {
      state: {
        data: {
          _id: userId
        }
      }
    })
  }

}
