
export enum DeliveryMode {
    Prepaid = "Prepaid",
    COD = "COD",
}

export enum Static {
    DELIVERY_CHARGES = 80
}

export interface Login {
    email: string;
    password: string;
    otp?:string;
    otp_id?:string;
}

export interface SnackBarMessage {
    message: string;
    action?: string;
}

export interface Register {
    name: string;
    email: string;
    city: string;
    phone:string;
    state: string;
    password:string;
    otp:string;
    otp_id:string;
}

export interface User {
    name: string;
    email: string;
    createdAt: string;
    image:string;
    state:string;
    city:string;
}

export interface Seller {
    name: string;
    email: string;
    createdAt: string;
    store_details?:any;
    admin_approval?:String
}

export interface CMS {
    type: string;
}

export interface AddCookie {
    key: string;
    value: string;
}

export interface Pagination {
    limit: number;
    offset: number;
}

export interface Meta {
    title: string;
    description: string;
    og_meta_keywords: string;
    og_meta_description: string;
    og_description: string;
    og_image: string;
    og_title: string;
    og_site: string;
}

export interface CalculateTotal {
    amount : number,
    withoutoutDiscount : number
}

export interface DuplicatePropertyResponse {
    isDuplicate : boolean,
}

export interface DeliveryCharges {
    charges : number,
}

export interface WeightCalculated {
    weight_in_g : number,
    weight_in_kg : number,
}

export interface Rating {
    rating1 : number,
    rating2 : number,
    rating3 : number,
    rating4 : number,
    rating5 : number
}

export interface RegisterOTPResponse {
    code : number,
    otp : number,
    _id : string
}

export interface EmptyResponse {
    code : number
}

export interface Language {
    name : string
}

export interface NotificationSetting {
    nany_message : boolean,
    nanny_live : boolean,
    _id : string,
    user_id : string,
    createdAt : string,
    updatedAt : string,

}

export interface NotificationSettingResponse {
    code : number,
    data : NotificationSetting,
}

export interface SupervisorProfile {
    supervisor_address : string,
    admin_approval : string,
    covid_vaccinated : boolean,
    createdAt : string,
    email : string,
    status : string,
    image : string,
    has_childrens : boolean,
    id_proof : {
        front : string,
        back : string
    },
    is_profile_submitted : boolean,
    language_spoken : [{
        name : string
    }],
    location : {
        type : string,
        coordinates : any[]
    },
    name : string,
    no_of_childrens : number,
    phone : string,
    police_verification : string,
    role : string,
    updatedAt : string,
    verification : string,
    verified : string,
    gender : string,
    work_experience : string,
    _id : string,
    
}

export interface NannyProfile {
    address : {
        pincode :string,
        state :string,
        city :string,
        district :string,
        complete_address :string,
        Pin_Location :{
            lat : number,
            long : number
        },

    },
    status : string,
    admin_approval : string,
    covid_vaccinated : boolean,
    createdAt : string,
    email : string,
    image : string,
    has_childrens : boolean,
    id_proof : {
        front : string,
        back : string
    },
    is_profile_submitted : boolean,
    language_spoken : [{
        name : string
    }],
    location : {
        type : string,
        coordinates : any[]
    },
    name : string,
    no_of_childrens : number,
    phone : string,
    police_verification : string,
    role : string,
    updatedAt : string,
    verification : string,
    verified : string,
    work_experience : string,
    nany_dob : string,
    parent_app_users : any[],
    child_details : any[],
    _id : string,
    gender : string,
    experience : number,
    about : string,
    
}

export interface GetProfileResponse {
    data : SupervisorProfile,
    code : number
}

export interface AssignedNannies {
    _id : string,
    nanny_id : string,
    supervisor_id : string,
    createdAt : string,
    updatedAt : string,
    supervisor_data : SupervisorProfile,
    nanny_data : NannyProfile,
}

export interface AssignedNanniesResponse {
    code : number,
    data : AssignedNannies[],
    count : 0,
}

export interface NannyProfileResponse {
    code : number,
    data : NannyProfile
}

export interface Term {
    role : string,
    _id : string,
    content : string,
    createdAt : string,
    updatedAt : string
}

export interface TermsResponse {
    code : number,
    data : Term
}

