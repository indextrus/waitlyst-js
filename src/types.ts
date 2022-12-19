export enum AnalyticsType {
  trackEnd = "trackEnd",
  pageEnd = "pageEnd",
  identifyEnd = "identifyEnd",
  alias = "alias",
  screen = "screen",
  group = "group",
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
    };
    properties?: {
      [key: string]: any;
    };
    traits?: {
      [key: string]: any;
    };
    type: keyof typeof AnalyticsType;
    userId: string;
    groupId?: string;
    previousId?: string;
    event?: string;
  };
}

export type Trait = {
  [key: string]: any;
};

export enum ElementType {
  FEEDBACK = "feedback",
  SURVEY = "survey",
  FORM = "form",
}

export type ElementData = {
  id: string;
  index: number;
  type: ElementType;
};
