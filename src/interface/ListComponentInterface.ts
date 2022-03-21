export interface ListBaseInterface{
    city?: CityInfoInterface;
    cate?: CatentryInterface;
    searchUrl?: string;
    locallist?: Array<CityInfoInterface>;
    pageIndex?: number;
}

interface CityInfoInterface{
    dispid: string;
    name: string;
    listname: string;
}

interface CatentryInterface extends CityInfoInterface{}

export interface SearchResultInterface extends Pick<ListBaseInterface, 'cate' | 'locallist'> {}

export interface KeywordSearchInterface extends Exclude<ListBaseInterface, 'locallist'> {}

export interface CommonNavInterface extends Exclude<ListBaseInterface, 'city'> {}

export interface RecommendHouseInterface extends Pick<ListBaseInterface, 'cate' | 'locallist' | 'pageIndex'> {}

export interface NavConfigInterface{
    url: string;
    tag: string;
    text: string;
    active: boolean;
}

export interface MapInterface{
    room: Array<string>;
    toward: any;
    decoration: any;
}

export interface RecommendQueryInterface{
    room: string;
    bedroomnum: string | number;
    houseroom: string | number;
    cityId: string;
    areaId: string;
    shangquanId: string;
    cateId: string;
    price_range:string;
    xiaoquId: string;  
    fyfw?: number;
    subwayLine?: string;
    subwayStation?: string;
    gongyudeposit?: number;
    ishy?: number|string;
}

export interface HotResultsInterfaceReq{
    client: number;
    region: string;
    page: number;
    version: number;
    pageSize: number;
    cityId: string;
    cateId: number;
    userId: string;
    cookie: string;
    pageType: string;
    areaId: string;
    shangquanId: string;
    successCode?: any;
    failCode?: any;
}



