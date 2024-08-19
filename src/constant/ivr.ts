import { IvrTreeNodeType } from "../providers/types/IvrTreeNodeTypes";

// Dummy data
export const dummyTree: IvrTreeNodeType = {
    id: 1,
    label: 'Root',
    parentId: null,
    children: [
      {
        id: 2,
        label: 'Sales',
        parentId: 1,
        children: [
          {
            id: 3,
            label: 'Domestic',
            parentId: 2,
            children: [],
          },
          {
            id: 4,
            label: 'International',
            parentId: 2,
            children: [],
          },
        ],
      },
      {
        id: 5,
        label: 'Support',
        parentId: 1,
        children: [],
      },
    ],
  };
  