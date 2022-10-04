export enum AnalyticsType {
    trackEnd = 'trackEnd',
    pageEnd = 'pageEnd',
    identifyEnd = 'identifyEnd'
}
export interface AnalyticsEvent {
    payload: {
        anonymousId: string;
        meta: {
            ts: number;
            rid: string;
            hasCallback: boolean;
        };
        options: {
            [key: string]: any;
        }
        properties?: {
            [key: string]: any;
        }
        traits?: {
            [key: string]: any;
        }
        type: keyof typeof AnalyticsType;
        userId: string;
        event?: string;
    }
}
