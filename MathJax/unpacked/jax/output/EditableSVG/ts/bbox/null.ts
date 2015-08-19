/// <reference path="bbox.ts" />

class BBOX_NULL extends BBOX {
    constructor() {
        super.apply(arguments); // TODO: typescript apply super
        this.Clean();
    }
}
