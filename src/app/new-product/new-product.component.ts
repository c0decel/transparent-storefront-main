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
import { Product } from '../shared/models/product.model';

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
  products: Product[]=[];

  supplyDetailData: { [supplyId: string]: SupplyDetail } = {};
  selectedTags: { [tagId: string]: boolean } = {};
  selectedSupplies: { [supplyId: string]: boolean } = {};
  measurementUnits = ['grams', 'oz', 'piece'];

  optionOpen: 'discount' | 'product' | 'tag' | 'supply' | 'expense' | 'sale' | '' = 'product';

  newDiscountOpen: boolean = false;
  newProductOpen: boolean = true;
  newTagOpen: boolean = false;
  newSupplyOpen: boolean = false;
  newExpenseOpen: boolean = false;
  newSaleOpen: boolean = false;

  newProductData: any = { Name: '', Price: '', Description: '', Stock: '', Upcharge: '', Image: '', Tags: [], Supplies: [{SupplyID: '', Amount: '', Measurement: '', Name: '', Description: '', Supplier: ''}] };
  newSupplyData: any = { Name: '', Description: '', Cost: '', Quantity: '', Measurement: '', Supplier: ''};
  newDiscountData: any = { Name: '', Description: '', Type: '', Amount: 0, ExpiresOn: ''};
  newExpenseData: any = {Expense: '', Amount: '', Description: '', ExpenseDate: ''};
  newSaleData: any = {Sale: '', Amount: '', Description: '', SaleDate: ''};
  newTagData: any = {Tag: '', Description: ''};

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

    this.fetchProductData.getAllProducts().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error(`Error: ${error.toString()}`);
      }
    )
  }

  /**
   * Select or unselect tag
   * @param tagId selected tag
   */
  toggleTagSelection(tag: Tag): void {
    this.selectedTags[tag._id] = !this.selectedTags[tag._id];
  
    if (this.selectedTags[tag._id]) {
      this.newProductData.Tags.push(tag._id);
    } else {
      const index = this.newProductData.Tags.indexOf(tag._id);
      if (index !== -1) {
        this.newProductData.Tags.splice(index, 1);
      }
    }
    console.log(this.newProductData.Tags)
  }
  

  /**
   * Select or unselect supply
   * @param supplyId selected supply
   */
  toggleSupplySelection(supply: Supply): void {
    this.selectedSupplies[supply._id] = !this.selectedSupplies[supply._id];
    console.log(supply._id)
  
    if (this.selectedSupplies[supply._id]) {
      this.supplyDetailData[supply._id] = { selected: true, Amount: 0, Measurement: '' };
    } else {
      delete this.supplyDetailData[supply._id];
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

  /**
   * Manually log new expense
   */
  postNewExpense(): void {
    this.fetchApiData.addNewExpense(this.newExpenseData).subscribe(
      (result) => {
        alert(`New expense added.`)
        console.log(`New expense added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }

  /**
   * Manually log new sale
   */
  postNewSale(): void {
    this.fetchApiData.addNewSale(this.newSaleData).subscribe(
      (result) => {
        alert(`New sale added.`)
        console.log(`New sale added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }

  /**
   * Post new tag
   */
  postNewTag(): void {
    this.fetchApiData.addNewTag(this.newTagData).subscribe(
      (result) => {
        alert(`New tag added.`)
        console.log(`New tag added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }

  openTab(optionType: 'discount' | 'product' | 'tag' | 'supply' | 'expense' | 'sale'): void {
    this.optionOpen = optionType;
  }
}
