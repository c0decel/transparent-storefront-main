import { Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchProductDataService } from '../services/fetch-product-data.service';

//Import models
import { User } from '../shared/models/user.model';
import { Supply } from '../shared/models/supply.model';
import { Tag } from '../shared/models/tag.model';

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
  user!: User;
  allTags: Tag[] = [];
  allSupplies: Supply[] = [];

  supplyDetailData: { [supplyId: string]: SupplyDetail } = {};
  selectedTags: { [tagId: string]: boolean } = {};
  selectedSupplies: { [supplyId: string]: boolean } = {};
  measurementUnits = ['grams', 'oz', 'piece'];

  newProductData: any = { Name: '', Price: '', Description: '', Stock: '', Upcharge: '', Image: '', Tags: [], Supplies: [{SupplyID: '', Amount: '', Measurement: '', Name: '', Description: '', Supplier: ''}] };
  newSupplyData: any = { Name: '', Description: '', Cost: '', Quantity: '', Measurement: '', Supplier: ''};
  newDiscountData: any = { Name: '', Description: '', Type: '', Amount: 0, ExpiresOn: ''};

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
    this.user = this.authService.getUser();

    if (!this.authService.isJanitor()) {
      this.router.navigate(['store']);
    }

    this.fetchApiData.getAllTags().subscribe(allTags => {
      this.allTags = allTags;
    });

    this.fetchApiData.getAllSupplies().subscribe(allSupplies => {
      this.allSupplies = allSupplies;
    });
  }

  /**
   * Toggle discount form
   */
  toggleDiscount(): void {
    this.discountFormVisible = !this.discountFormVisible
  }

  /**
   * Toggle new product form
   */
  toggleProduct(): void {
    this.productFormVisible = !this.productFormVisible
  }

  /**
   * Toggle new tag form
   */
  toggleTag(): void {
    this.tagFormVisible = !this.tagFormVisible
  }

  /**
   * Select or unselect tag
   * @param tagId selected tag
   */
  toggleTagSelection(tagId: string): void {
    this.selectedTags[tagId] = !this.selectedTags[tagId];

    if (!this.selectedTags[tagId]) {
      const index = this.newProductData.Tags.indexOf(tagId);
      if (index !== -1) {
        this.newProductData.Tags.splice(index, 1);
      }
    }
  }

  /**
   * Select or unselect supply
   * @param supplyId selected supply
   */
  toggleSupplySelection(supplyId: string): void {
    this.selectedSupplies[supplyId] = !this.selectedSupplies[supplyId];
    if (this.selectedSupplies[supplyId]) {
      this.supplyDetailData[supplyId] = { selected: true, Amount: 0, Measurement: '' };
    } else {
      delete this.supplyDetailData[supplyId];
    }
  }

  /**
   * Submit new discount
   */
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

  /**
   * Submit new product
   */
  submitNewProduct(): void {
    if (!this.newProductData.Image) {
      this.newProductData.Image = 'https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';
    }
    const selectedTags = this.allTags.filter(tag => this.selectedTags[tag.TagID]).map(tag => tag.TagID);
    this.newProductData.Tags = selectedTags;
  
    const selectedSupplies = this.allSupplies.filter(supply => this.selectedSupplies[supply.SupplyID]);
    const validSupplies = selectedSupplies.filter(supply => this.supplyDetailData[supply.SupplyID]);
  
    this.newProductData.Supplies = [];

    validSupplies.forEach(supply => {
      const costOz = supply.CostOz;
      const supplyId = supply.SupplyID;
      const supplyName = supply.Name;
      const supplyDescription = supply.Description;
      console.log(supply.Description)
      const supplySupplier = supply.Supplier;
      const supplyAmount = this.supplyDetailData[supply.SupplyID].Amount;
      const supplyMeasurement = this.supplyDetailData[supply.SupplyID].Measurement;
  
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
  
  /**
   * Calculate cost of used supplies
   * @param costOz cost per ounce
   * @param supplyAmount amount of supply
   * @param supplyMeasurement unit of measurement
   * @returns calculated cost of supply usage
   */
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
  
  /**
   * Submit new supply
   */
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
}
