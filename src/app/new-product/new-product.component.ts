import { Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { User } from '../models/user.model';

interface SupplyDetail {
  selected: boolean;
  Amount?: number;
  Measurement?: string;
  SupplyID?: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  newProductData: any = { Name: '', Price: '', Description: '', Stock: '', Upcharge: '', Image: '', Tags: [], Supplies: [{SupplyID: '', Amount: '', Measurement: '', Name: '', Description: '', Supplier: ''}] };
  newSupplyData: any = { Name: '', Description: '', Cost: '', Quantity: '', Measurement: '', Supplier: ''};
  newDiscountData: any = { Name: '', Description: '', Type: '', Amount: 0, ExpiresOn: ''};
  supplyDetailData: { [supplyId: string]: SupplyDetail } = {};
  allTags: any[] = [];
  allSupplies: any[] = [];
  selectedTags: { [tagId: string]: boolean } = {};
  selectedSupplies: { [supplyId: string]: boolean } = {};
  measurementUnits = ['grams', 'oz', 'piece'];
  user: User[] =[];

  discountFormVisible: boolean = false;
  productFormVisible: boolean = false;
  tagFormVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    public fetchProductData: FetchProductDataService,
    private fetchApiData: FetchApiDataService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.user = user;

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

  toggleDiscount(): void {
    this.discountFormVisible = !this.discountFormVisible
  }
  toggleProduct(): void {
    this.productFormVisible = !this.productFormVisible
  }
  toggleTag(): void {
    this.tagFormVisible = !this.tagFormVisible
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
    if (this.selectedSupplies[supplyId]) {
      this.supplyDetailData[supplyId] = { selected: true, Amount: 0, Measurement: undefined };
    } else {
      delete this.supplyDetailData[supplyId];
    }
  }

  submitNewDiscount(): void {
    this.fetchProductData.addNewDiscount(this.newDiscountData).subscribe(
      (result) => {
        console.log(`New discount created successfully: ${result}`);
        this.router.navigate(['store']);
      },
      (error) => {
        console.error(`Error posting new discount: ${error}`);
        console.log(this.newProductData);
      }
    );
  }

  submitNewProduct(): void {
    if (!this.newProductData.Image) {
      this.newProductData.Image = 'https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
    }
    const selectedTags = this.allTags.filter(tag => this.selectedTags[tag._id]).map(tag => tag._id);
    this.newProductData.Tags = selectedTags;
  
    const selectedSupplies = this.allSupplies.filter(supply => this.selectedSupplies[supply._id]);
    const validSupplies = selectedSupplies.filter(supply => this.supplyDetailData[supply._id]);
  
    this.newProductData.Supplies = [];

    validSupplies.forEach(supply => {
      const costOz = supply.CostOz;
      const supplyId = supply._id;
      const supplyName = supply.Name;
      const supplyDescription = supply.Description;
      console.log(supply.Description)
      const supplySupplier = supply.Supplier;
      const supplyAmount = this.supplyDetailData[supply._id].Amount;
      const supplyMeasurement = this.supplyDetailData[supply._id].Measurement;
  
      if (supplyId && supplyAmount && supplyMeasurement) {
        this.newProductData.Supplies.push({
          SupplyID: supplyId,
          Amount: supplyAmount,
          Measurement: supplyMeasurement,
          Supplier: supplySupplier,
          Name: supplyName,
          Description: supplyDescription,
          Cost: this.calculateCost(costOz, supplyAmount, supplyMeasurement)
        });
      }
    });
  
    this.fetchProductData.addNewProduct(this.newProductData).subscribe(
      (result) => {
        console.log(`New product created successfully: ${result}`);
        this.router.navigate(['store']);
      },
      (error) => {
        console.error(`Error posting new product: ${error}`);
        console.log(this.newProductData);
      }
    );
  }
  
  calculateCost(costOz: number, supplyAmount: number, supplyMeasurement: string): number {
    let convertedUnit = 0;
    
    if (supplyAmount) {
      switch (supplyMeasurement) {
        case 'oz':
          convertedUnit = supplyAmount * costOz;
          break;
        case 'grams':
          convertedUnit = (supplyAmount / 28) * costOz;
          break;
        default:
          convertedUnit = supplyAmount * costOz;
      }   
      return parseFloat(convertedUnit.toFixed(2));
    } else {
      return 0;
    }
  }
  

  submitNewSupply(): void {
    if (!this.newSupplyData.Supplier) {
      this.newSupplyData.Supplier = `None specified.`
    }

    this.fetchApiData.addNewSupply(this.newSupplyData).subscribe(
      (result) => {
        console.log(`New supply created successfully: ${result}`);
        this.router.navigate(['store']);
      },
      (error) => {
        console.error(`Error posting new supply: ${error}`);
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
