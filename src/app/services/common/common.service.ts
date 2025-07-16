import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {
  CalculateTotal,
  DeliveryCharges,
  DeliveryMode,
  DuplicatePropertyResponse,
  Static,
  WeightCalculated,
} from 'src/app/models/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private cookieService: CookieService) {}

  images = [];

  /**
   * Compare all discount like Catalog, Customer Group and Product Based
   * @param {Number} mrp - current MRP
   * @param {Number} admin_discount - product based discount
   * @param {Array} catalogs - product based discount
   * @param {Object} cusomergroup - Customer Group based
   */
  calculatePrice(
    mrp: number,
    admin_discount: number,
    catalogs?: Array<any>,
    customergroup?: any
  ): number {
    const percentageOff = admin_discount ? admin_discount : 0;

    const percentAmount = (mrp * percentageOff) / 100;

    return parseFloat((mrp - percentAmount).toFixed(2));
  }

  /**
   * Compare all discount like Catalog, Customer Group and Product Based
   * @param {Number} mrp - current MRP
   * @param {Number} catalog_discount - product based discount
   
  */
  calculatePrice1(mrp: number, catalog_discount: number): number {
    const percentageOff = catalog_discount ? catalog_discount : 0;

    const percentAmount = (mrp * percentageOff) / 100;

    return parseFloat((mrp - percentAmount).toFixed(2));
  }

  /**
   * Calculate amount for the customer
   * @param {number} mrp - current MRP
   * @param {number} quantity - cart quantity
   * @param {number} bulkQuantity - bulk quantity
   * @param {number} bulkDiscount - bulk discount
   */
  calculateTotalItemPrice(
    mrp: number,
    quantity: number,
    bulkArray: any[],
    bulkDiscount: any
  ): any {
    const withoutBulkDiscount = mrp * quantity;

    // First for all we have to check quantity
    var freeObj = null;
    if (bulkArray) {
      for (var i = 0; i < bulkArray.length; i++) {
        const val = bulkArray[i];

        if (quantity >= val.quantity) {
          freeObj = val;
        }
      }
    }

    if (freeObj) {
      const afterBulkDiscount = freeObj.price_per_item * quantity;

      const obj = {
        afterBulkDiscount: afterBulkDiscount,
        withoutBulkDiscount: withoutBulkDiscount,
        isBulkApplied: true,
        bulkDiscount: (
          ((withoutBulkDiscount - afterBulkDiscount) * 100) /
          afterBulkDiscount
        ).toFixed(0),
      };

      return obj;
    }

    return {
      withoutBulkDiscount: withoutBulkDiscount,
      isBulkApplied: false,
    };

    // if(bulkQuantity == quantity){ // if bulk quantity and current quantity match

    //   const afterBulkDiscount = withoutBulkDiscount * bulkDiscount / 100;

    //   const obj = {
    //     afterBulkDiscount : withoutBulkDiscount - afterBulkDiscount,
    //     withoutBulkDiscount : withoutBulkDiscount,
    //     isBulkApplied : true,
    //     bulkDiscount : bulkDiscount,
    //   }

    //   return obj

    // }else{
    //   return {
    //     withoutBulkDiscount : withoutBulkDiscount,
    //     isBulkApplied : false
    //   }
    // }
  }

  /**
   * Find theimage from media. In media have video also
   * @param {Array} media - Array of media
   */
  validateImageFromMedia(media: Array<any>): any {
    const exts = this.getImageExtensions();
    for (var i = 0; i < media?.length; i++) {
      const val = media[i];
      if (exts.includes(this.get_url_extension(val.name).toLowerCase())) {
        return {
          name: val.name,
          // url: environment.PRODUCT_MEDIA + '' + val.name,
        };
      }
    }

    return {
      name: environment.DEFAULT_IMAGE,
      url: environment.DEFAULT_IMAGE,
    };
  }

  /**
   * Determine the extension from URL
   * @param {string} url - string
   */
  get_url_extension(url: any): string {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  /**
   * return all image extensions
   */
  getImageExtensions(): Array<any> {
    return ['jpg', 'jpeg', 'png', 'gif'];
  }

  /**
   * trims the extra characters
   * @param {string} str - request string
   * @param {number} length - length number
   */
  trimString(str: string, length: number): any {
    if (str.length > length) {
      return {
        trimmed_str: str.substring(1, length),
        full_str: str,
        read_more_required: true,
      };
    } else {
      return {
        trimmed_str: str,
        full_str: str,
        read_more_required: false,
      };
    }
  }

  /**
   * getnerate the session for cart
   */
  generateSession(): void {
    const session_id = '_' + Math.random().toString(36).substr(2, 9);

    if (!this.cookieService.get('_session')) {
      this.cookieService.set('_session', session_id);
    }
  }
  generateSession1(): void {
    const session_id = '_' + Math.random().toString(36).substr(2, 9);
    this.cookieService.set('_session', session_id);
  }

  /**
   * Logout from browser
   */
  logout(): void {
    sessionStorage.clear();
    localStorage.clear();
    // delete cookies
    this.deleteAllCookies();
  }

  /**
   * Delete All Cookies
   */
  deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    }
}

  /**
   * Find the Variant with variant id
   * @param {Array} variants - Array of variants
   * @param {string} variant_id - variant id which need to find
   */
  getCurrentVariant(variants: Array<any>, variant_id: string): any {
    return variants.find((item) => item._id == variant_id);
  }

  /**
   * Calculate the total amount in the cart list
   * @param {Array} cartList - Array of cart
   * @param {Any} extra - Optional param, if need anything
   */
  calculateTotal(cartList: Array<any>, extra?: any): CalculateTotal {
    var tempAmount = 0;
    var withoutDiscount = 0;
    for (var i = 0; i < cartList.length; i++) {
      const val = cartList[i];
      const variant = this.getCurrentVariant(
        val.product_id.variants,
        val.variant_id
      );

      const respCatalog = this.calculateCatalogDiscount(
        val.catalog_products ? val.catalog_products : []
      );

      var discount = variant?.admin_discount;

      if (respCatalog.discount > 0) {
        discount = discount + respCatalog.discount;
      }
      // If Bulk discount available then we have to calculate according bulk. If bulk not available the we have to calculate amount.

      // We have calculate Admin discount and Catalog discount.
      var am = this.calculatePrice(variant?.price * val.quantity, discount);

      // Bulk discount
      if (variant?.sell_in_bulk) {
        const resp = this.calculateTotalItemPrice(
          variant.price,
          val.quantity,
          variant.sellBulkValues,
          variant.bulk_discount
        );

        if (resp.isBulkApplied) {
          // If bulk availabe then no need to check admin discount

          // If bulk applied then add actual money
          tempAmount = tempAmount + resp.afterBulkDiscount;

          // If if catalog discount availabe the we have to add discount too
          if (respCatalog.discount > 0) {
            tempAmount =
              tempAmount -
              (resp.afterBulkDiscount * respCatalog.discount) / 100;
          }
        } else {
          // If bulk not availabe then need to check admin discount
          tempAmount = tempAmount + am;
        }
      } else {
        // If bulk not availabe then need to check admin discount
        tempAmount = tempAmount + am;
      }

      // Witout discount
      withoutDiscount = withoutDiscount + variant?.price * val.quantity;
    }

    return {
      amount: tempAmount,
      withoutoutDiscount: withoutDiscount,
    };
  }

  /**
   * Calculate the total amount in the cart list
   * @param {Array} catalogs - Array of product catlog
   * @param {Any} extra - Optional param, if need anything
   */
  calculateCatalogDiscount(catalogs: any[], extra?: any): any {
    var discount = 0;
    var catalog_details = null;

    for (var i = 0; i < catalogs.length; i++) {
      const val = catalogs[i];
      if (val.catalog_details.discount > discount) {
        discount = val.catalog_details.discount;
        catalog_details = val.catalog_details;
      }
    }

    return {
      discount: discount,
      catalog: catalog_details,
    };
  }

  /**
   * Calculate the total amount in the cart list
   * @param {Array} cartList - Array of cart
   * @param {Any} extra - Optional param, if need anything
   */
  calculateDiscountAmount(cartList: Array<any>, extra?: any): number {
    var tempAmount = 0;
    var amount = 0;
    for (var i = 0; i < cartList.length; i++) {
      const val = cartList[i];
      const variant = this.getCurrentVariant(
        val.product_id.variants,
        val.variant_id
      );
      const respCatalog = this.calculateCatalogDiscount(
        val.catalog_products ? val.catalog_products : []
      );
      var discount = variant?.admin_discount ? variant.admin_discount : 0;
      if (respCatalog.discount > 0) {
        discount = discount + respCatalog.discount;
      }
      // If Bulk discount available then we have to calculate according bulk. If bulk not available the we have to calculate amount.

      // first we have to check Catalogwise. and Admin discount wise

      // Bulk discount
      if (variant.sell_in_bulk) {
        const resp = this.calculateTotalItemPrice(
          variant.price,
          val.quantity,
          variant.sellBulkValues ? variant.sellBulkValues : [],
          variant.bulk_discount
        );

        if (resp.isBulkApplied) {
          // If bulk availabe then no need to check admin discount

          // If bulk applied then add discount
          tempAmount =
            tempAmount + (resp.withoutBulkDiscount - resp.afterBulkDiscount);

          // If if catalog discount availabe the we have to add discount too
          if (respCatalog.discount > 0) {
            tempAmount =
              tempAmount +
              (resp.afterBulkDiscount * respCatalog.discount) / 100;
          }
        } else {
          // If bulk not availabe then need to check admin discount
          tempAmount =
            tempAmount + (variant.price * val.quantity * discount) / 100;
        }
      } else {
        // If bulk not availabe then need to check admin discount
        tempAmount =
          tempAmount + (variant.price * val.quantity * discount) / 100;
      }
    }

    return (amount = parseFloat(tempAmount.toFixed(2)));
  }

  calculateTotalQuantity(listItem: any): any {
    listItem.variants.forEach((item: any) => {
      item.totalQuantity = 0;
      item.inventory_and_warehouse = item.inventory_and_warehouse.map(
        (quantity: any) => {
          item.totalQuantity = item.totalQuantity + quantity.stock_quantity;
          return quantity;
        }
      );
    });
    return listItem;
  }

  /**
   * Get current variant info
   * @param {Array} variants - Array of variants
   * @param {String} variant_id - Id of variant
   */
  variantInfo(variants: Array<any>, variant_id?: string): any {
    var tempVariant = variants[0];

    if (variant_id) {
      tempVariant = this.getCurrentVariant(variants, variant_id);
    }

    const media = this.validateImageFromMedia(tempVariant?.media);
    const price = this.calculatePrice(
      tempVariant?.price,
      tempVariant?.admin_discount
    );

    return {
      variant: tempVariant,
      price: price,
      media: media,
    };
  }

  /**
   * Calculate bulk products
   * @param {Number} price - price of product with discount calculate
   */
  bulkProductCalculate(price: number, discountBulk: number): number {
    return 0;
  }

  /**
   * Search array value to string
   * @param {Array} routes - ignore routes
   * @param {String} url - want to search
   */
  checkIgnoreRoute(routes: Array<any>, url: string): boolean {
    for (let item of routes) {
      if (url.includes(item)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Compare all discount like Catalog, Customer Group and Product Based
   * @param {Number} mrp - current price
   * @param {Number} admin_discount - product based discount
   * @param {Array} catalogs - product based discount
   * @param {Object} cusomergroup - Customer Group based
   */
  compareDiscount(
    mrp: number,
    admin_discount: number,
    catalogs?: Array<any>,
    cusomergroup?: any
  ): number {
    const percentageOff = admin_discount;

    const percentAmount = (mrp * percentageOff) / 100;

    return parseFloat((mrp - percentAmount).toFixed(2));
  }

  /**
   * Apply promocode
   * @param {Number} mrp - current price
   * @param {Number} percent - percent
   */
  addPromocodePrice(mrp: number, percent: number): any {
    const percentageOff = percent;

    const percentAmount = (mrp * percentageOff) / 100;

    return {
      percentAmount: percentAmount,
    };
  }

  /**
   * Convert from object to FormData
   * @param {Object} object - JavaScript Object
   */
  convertObjectToFormData(object: any): any {
    var form_data = new FormData();

    for (var key in object) {
      form_data.append(key, object[key]);
    }

    return form_data;
  }

  /**
   * Find duplicate property from Array of Object
   * @param {Array} values - Array of Object
   * @param {String} property - Find property
   */
  findDuplicateProperty(
    values: Array<any>,
    property: string
  ): DuplicatePropertyResponse {
    const lookup = values.reduce((a, e) => {
      a[e[property]] = ++a[e[property]] || 0;
      return a;
    }, {});

    if (values.filter((e) => lookup[e[property]]).length > 0) {
      return {
        isDuplicate: true,
      };
    } else {
      return {
        isDuplicate: false,
      };
    }
  }

  /**
   * Calculate the Total Weight
   * @param {Array} cartList - Array of Object
   */
  calculateWeightCartItem(cartList: any[]): WeightCalculated {
    var weight = 0; // In Grams

    for (var i = 0; i < cartList.length; i++) {
      const val = cartList[i];

      const variant = this.getCurrentVariant(
        val.product_id.variants,
        val.variant_id
      );

      if (variant) {
        if (variant.weight_type.toLowerCase() == 'kg') {
          // convert to gram
          weight = variant.weight * 1000;
          weight *= val.quantity;
        } else {
          weight = variant.weight *= val.quantity; // IN Grams
        }
      }
    }
    return {
      weight_in_g: weight,
      weight_in_kg: weight / 1000,
    };
  }

  /**
   * Calculate the delivery Charges
   * @param {Array} weight_range - Array of Object
   * @param {Array} price_range - Array of Object
   * @param {Number} order_value - Total value of order
   * @param {String} delivery_mode - Delivery mode
   * @param {Array} cartList - Cart Items
   * @param {any} extra - If extra params
   */
  calculateDeliveryCharges(
    weight_range: any[],
    price_range: any[],
    order_value: number,
    delivery_mode: DeliveryMode,
    cartList: any[],
    extra?: any
  ): DeliveryCharges {
    //First of all we have to find, if delivery is free or not , Whether its COD or prepaid
    const isInModePrepaid = price_range.find(
      (item: any) =>
        item.forPrepaid &&
        delivery_mode == DeliveryMode.Prepaid &&
        order_value >= item.from &&
        order_value <= item.to
    );
    const isInModeCOD = price_range.find(
      (item: any) =>
        item.forCOD &&
        delivery_mode == DeliveryMode.COD &&
        order_value >= item.from &&
        order_value <= item.to
    );

    // now we have to check price range
    if (isInModePrepaid || isInModeCOD) {
      return {
        charges: 0,
      };
      /*
      const isQualifyForFree = price_range.find((item: any) => order_value >= item.from && order_value <= item.to)
     
      if (isQualifyForFree) {
        return {
          charges: 0
        }
      } else {

        // Now we have to calculate weight
        const weight = this.calculateWeightCartItem(cartList).weight_in_kg;

        const gram = weight_range.find((item: any) => weight >= item.from && weight <= item.to);

        if(gram){
          return {
            charges: gram.charges
          }
        }else{          
          return {
            charges: Static.DELIVERY_CHARGES
          }
        }

      }*/
    } else {
      const weight = this.calculateWeightCartItem(cartList).weight_in_kg;

      const gram = weight_range.find(
        (item: any) => weight >= item.from && weight <= item.to
      );

      if (gram) {
        return {
          charges: gram.charges,
        };
      } else {
        return {
          charges: Static.DELIVERY_CHARGES,
        };
      }
    }
  }

  youtube_parser(url: string) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }

  calculateDeliveryChargesN(
    weight_range: any[],
    price_range: any[],
    free_delivery: any[],
    defaultDcharges: number,
    order_value: number,
    delivery_mode: DeliveryMode,
    cartList: any[],
    extra?: any
  ): DeliveryCharges {
    //First of all we have to find, if delivery is free or not , Whether its COD or prepaid
    const isInModePrepaid = free_delivery.find(
      (item: any) =>
        item.forPrepaid &&
        delivery_mode == DeliveryMode.Prepaid &&
        order_value >= item.from &&
        order_value <= item.to
    );
    const isInModeCOD = free_delivery.find(
      (item: any) =>
        item.forCOD &&
        delivery_mode == DeliveryMode.COD &&
        order_value >= item.from &&
        order_value <= item.to
    );
    // now we have to check price range
    if (isInModePrepaid || isInModeCOD) {
      return {
        charges: 0,
      };
    } else {
      const pricerange = price_range.find(
        (item: any) =>
          item.forCOD &&
          delivery_mode == DeliveryMode.COD &&
          order_value >= item.from &&
          order_value <= item.to
      );
      const pricerangepre = price_range.find(
        (item: any) =>
          item.forPrepaid &&
          delivery_mode == DeliveryMode.Prepaid &&
          order_value >= item.from &&
          order_value <= item.to
      );

      console.log(pricerange, 'pricerange');
      console.log(pricerangepre, 'pricerangepre');

      const weight = this.calculateWeightCartItem(cartList).weight_in_kg;

      // alert(weight);

      const gram = weight_range.find(
        (item: any) => weight >= item.from && weight <= item.to
      );
      console.log(gram, 'gram');

      const priceR = delivery_mode == DeliveryMode.COD ? pricerange : pricerangepre;

      var priceAmount = priceR ? priceR.charges : defaultDcharges;
      var gramAmount = gram ? gram.charges : defaultDcharges;

      console.log('gramAmount: ', gramAmount);      
      console.log('priceAmount: ', priceAmount);

      if(gramAmount == priceAmount){
        return {
          charges: gramAmount,
        }
      }else if(gramAmount > priceAmount){
        return {
          charges: gramAmount,
        }
      }else{
        return {
          charges: priceAmount,
        }
      }


      // if (delivery_mode == DeliveryMode.COD) {
      //   if (
      //     ((pricerange?.charges && gram?.charges) ||
      //       (!pricerange?.charges && gram?.charges) ||
      //       (!gram?.charges && pricerange?.charges)) < defaultDcharges
      //   ) {
          
      //     return {
      //       charges: defaultDcharges,
      //     };
      //   } else {
      //     if (pricerange && !pricerange.charges && !gram.charges) {
      //       return {
      //         charges: defaultDcharges,
      //       };
      //     } else {
      //       if (
      //         ((!gram && pricerange?.charges) ||
      //           (!pricerange && gram?.charges) ||
      //           (gram?.charges && pricerange?.charges) ||
      //           gram?.charges ||
      //           pricerange?.charges) > defaultDcharges
      //       ) {
      //         var gramCharges = gram ? gram.charges : defaultDcharges;
      //         var priceCharges = pricerange
      //           ? pricerange.charges
      //           : defaultDcharges;

      //         return {
      //           charges: Math.max(Number(gramCharges), Number(priceCharges)),
      //         };
      //       }
      //     }
      //   }
      // }
      //  else {
      //   if (pricerangepre && pricerangepre.charges > defaultDcharges) {
      //     return {
      //       charges: Number(pricerangepre.charges),
      //     };
      //   }
      //   if (pricerangepre && pricerangepre.charges < defaultDcharges) {
      //     return {
      //       charges: Number(defaultDcharges),
      //     };
      //   }
      //   if (pricerangepre && gram) {
      //     return {
      //       charges: Math.max(Number(pricerangepre?.charges), Number(gram?.charges) , Number(defaultDcharges)),
      //     };
      //   }
      //   if (pricerangepre && pricerange) {
      //     return {
      //       charges: Math.max(Number(pricerangepre?.charges), Number(pricerange?.charges) , Number(defaultDcharges)),
      //     };
      //   }
      //   if (pricerangepre && gram && pricerange) {
      //     return {
      //       charges: Math.max(
      //         Number( pricerangepre?.charges),
      //         Number(gram?.charges),
      //         Number(pricerange?.charges),
      //         Number(defaultDcharges)
      //       ),
      //     };
      //   }
      // }
    }

    return {
      charges: defaultDcharges,
    };
  }

  /**
   * Calculate age from Date of birth
   * @param {String} dob - Date of Birth
   */
  calculateAgeFromDOB(date:string){
    var dob = new Date(date);  
    //calculate month difference from current date in time  
    var month_diff = Date.now() - dob.getTime();  
      
    //convert the calculated difference in date format  
    var age_dt = new Date(month_diff);   
      
    //extract year from date      
    var year = age_dt.getUTCFullYear();  
      
    //now calculate the age of the user  
    var age = Math.abs(year - 1970); 
    
    return age

  }

  /**
   * Map with specific key
   * @param {Array} array - Array
   * @param {string} key - which key want to map
   */
  mapArray(array:any[],key:string){
    return array.map(item => item[key]) 

  }
}
