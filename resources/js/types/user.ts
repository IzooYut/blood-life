export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    region:string;
    referral_code:string;
    company_name:string;
    website_url:string;
    created_at: string;
    updated_at: string;
  }
  
  export interface ShippingRate
  {
    id:number;
    name:string;
    country:string;
    shipping_type:string;
    rate_per_cbm:number;
    rate_per_cbf:number;
    rate_per_kg:number;
    handling_fee:number;
    currency:string;
  }


   export interface BloodGroup
  {
    id:number;
    name:string;
    created_at:string;
  }

  export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  export interface PaginationMeta {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  }
  
  export interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    meta: PaginationMeta;
  }

  export interface PaginatedShippingRates {
    data:ShippingRate[],
    links:PaginationLink[],
    meta:PaginationMeta,
    current_page:number,
    per_page:number
  }

    export interface PaginatedBloodGroups {
    data:ShippingRate[],
    links:PaginationLink[],
    meta:PaginationMeta,
    current_page:number,
    per_page:number
  }
  