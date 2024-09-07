export interface IvrType {
  id?: number;
  name?: string;
  campaignId?: string;
  parentId?: number;
  branch?: number;
  type?: string;
  value?: string;
}

export interface BulkIvrType {
  ivrs: IvrType[];
}
