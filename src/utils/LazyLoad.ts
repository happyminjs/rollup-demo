export default class LazyLoad {
    private _options: object = {
        srckey: 'lazy_src',
        offset: 200,
        defultSrc: document.location.protocol + "//img.58cdn.com.cn/ui7/fang/detail/img/default.png"
    };
    private elements: Array<HTMLImageElement>;

    constructor(option?){
        this._options = Object.assign(this._options, option);
        this.bindEvent();
        this.scrollHandler();
        $(window).scroll();
    }

    
    private bindEvent(): void{
        let _this = this;
        if((<any>window).addEventListener){
            (<any>window).addEventListener("scroll", _this.scrollHandler.bind(_this), false);
        } else {
            (<any>window).attachEvent("onscroll", _this.scrollHandler.bind(_this), false);
        }
    }

    private scrollHandler(): void{
        this.elements = document.querySelectorAll(`img[${this._options['srckey']}]`) as any;
        for(let element of this.elements){
            let src = element.attributes[this._options['srckey']].value;
            let loaded = element.attributes['data-loaded'];
            if(!loaded && src && this.inVisibleArea(element)){
                this.loadImage(element, src);
            }
        }
    }


    private inVisibleArea(element: HTMLImageElement | any): boolean{
        let viewHeight: number = this.getViewHeight();
        let scrollTop: number = this.getScrollTop();
        let elementOffsetTop: number = this.getOffsetTop(element);
        let visible: boolean = elementOffsetTop < viewHeight + scrollTop + this._options['offset'];
        return visible;
    }

    private loadImage(image:  HTMLImageElement | any, src: string): void{
        image.src = src;
        if(image['addEventListener']){
            image['addEventListener']("load", () => {image.setAttribute('data-loaded', true)}, false);
        } else {
            image['attachEvent']("load", () => {image.setAttribute('data-loaded', true)}, false);
        }
    }


    //屏幕可视高度
    private getViewHeight(): number {
        // 标准浏览器及IE9+ || 标准浏览器及低版本IE标准模式 || 低版本混杂模式
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    //滚动高度
    private getScrollTop(): number {
        // 标准浏览器及IE9+ || 标准浏览器及低版本IE标准模式 || 低版本混杂模式
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    }

    //元素位置
    private getOffsetTop(el:  HTMLImageElement | any): number{
        return el.offsetParent
            ? el.offsetTop + this.getOffsetTop(el.offsetParent)
            : el.offsetTop
    }
};


