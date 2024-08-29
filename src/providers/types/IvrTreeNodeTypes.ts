export interface IvrTreeNodeType {
    id: number;
    label: string;
    parentId: number | null;
    children: IvrTreeNodeType[];
    branch: number | string;
    type: string;
  }