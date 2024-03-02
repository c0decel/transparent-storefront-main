import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  newProductData: any = { Name: '', Price: '', Description: '', Stock: '', Upcharge: '', Image: '', Tags: [], Supplies: [] };
  newSupplyData: any = { Name: '', Description: '', Cost: '', Quantity: '', Measurement: '', Supplier: ''};
  allTags: any[] = [];
  allSupplies: any[] = [];
  selectedTags: { [tagId: string]: boolean } = {};
  selectedSupplies: { [supplyId: string]: boolean} = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();

    if (!this.authService.isJanitor()) {
      this.router.navigate(['store']);
    }

    if (!user._id) {
      this.router.navigate(['store']);
      return;
    }

    this.fetchApiData.getAllTags().subscribe(allTags => {
      this.allTags = allTags;
    });

    this.fetchApiData.getAllSupplies().subscribe(allSupplies => {
      this.allSupplies = allSupplies;
    });
  }

  toggleTagSelection(tagId: string): void {
    this.selectedTags[tagId] = !this.selectedTags[tagId];

    if (!this.selectedTags[tagId]) {
      const index = this.newProductData.Tags.indexOf(tagId);
      if (index !== -1) {
        this.newProductData.Tags.splice(index, 1);
      }
    }
  }

  toggleSupplySelection(supplyId: string): void {
    this.selectedSupplies[supplyId] = !this.selectedSupplies[supplyId];

    if (!this.selectedSupplies[supplyId]) {
      const index = this.newProductData.Supplies.indexOf(supplyId);
      if (index !== -1) {
        this.newProductData.Supplies.splice(index, 1);
      }
    }
  }

  submitNewProduct(): void {
    if (!this.newProductData.Image) {
      this.newProductData.Image = 'https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
    }
    const selectedTags = this.allTags.filter(tag => this.selectedTags[tag._id]).map(tag => tag._id);
    this.newProductData.Tags = selectedTags;

    const selectedSupplies = this.allSupplies.filter(supply => this.selectedSupplies[supply._id]).map(supply => supply._id);
    this.newProductData.Supplies = selectedSupplies;
    
    this.fetchApiData.addNewProduct(this.newProductData).subscribe(
      response => {
        console.log('New product created successfully: ', response);
        this.router.navigate(['store']);
      },
      error => {
        console.error('Error creating new product: ', error);
      }
    );
  }

  submitNewSupply(): void {
    if (!this.newSupplyData.Supplier) {
      this.newSupplyData.Supplier = 'None specified.'
    }

    this.fetchApiData.addNewSupply(this.newSupplyData).subscribe(
      response => {
        console.log('New supply created: ', response);
        this.router.navigate(['store']);
      },
      error => {
        console.error('Error creating supply: ', error);
      }
    );
  }
  
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['store']);
  }
  
}
