/**
 * 房源基本信息
 */
import "./HouseBasicInfo.less"
import Request from '../../utils/request';

interface Data {
    code: number | string,
    imgURL: string
}

export default class HouseBasicInfo {
    constructor (props) {
        this.init(props);
    }
    private init (props) : void {
        let _this = this;
        let locallist = props.locallist;
        let locallist0 = locallist[0];

        if (locallist && locallist0) {
            let brokerId = props.sanWangBrokerId;
            if (brokerId) {
                _this.fetchData(brokerId, (data) => {
                    if (data) {
                        let businessLicenseId = data.businessLicenseId, businessLicenseImage = data.businessLicenseImage;
                        //从业人员编号
                        if($(".employment-num").length>0){
                            _this.getTemplate(
                                {
                                    code: businessLicenseId,
                                    imgURL: businessLicenseImage
                                }
                            )
                        }
                    }
                })
            }
        }
    }
    private fetchData (brokerId:string | number, cb:Function) : void {
        Request.jsonp('//rentercenter.58.com/broker/api_get_cert_company', {
            brokerId: brokerId,
            successCode: 64332,
            failCode: 64333
        }, 'jsoncallback').then((res: any) => {
            if (res && res.code === 0 && res.data) {
                cb(res.data)
            }
        })
        // $.ajax({
        //     url: "//rentercenter.58.com/broker/api_get_cert_company",
        //     type: "get",
        //     data: {
        //         brokerId: brokerId
        //     },
        //     dataType: "jsonp",
        //     jsonp: "jsoncallback",
        //     success: (res) => {
        //         if (res && res.code === 0 && res.data) {
        //             cb(res.data)
        //         }
        //     }
        // })
    }
  
    private getTemplate (data : Data) :void {
        if (data.code) {
            let template = 
                `<span class="name">从业人员编号</span> 
                 <span class="code">${data.code}</span>
                `
               $('.employment-num').append(template);
        }
    } 
}