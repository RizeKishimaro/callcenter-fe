import React from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { IvrTreeNodeType } from '../providers/types/IvrTreeNodeTypes';

type TreeProps = {
  tree: IvrTreeNodeType;
  onRemoveNode?: (nodeId: number) => void;
  canRemoveNode: boolean;
};

const Tree: React.FC<TreeProps> = ({ tree, onRemoveNode, canRemoveNode }) => {
  const renderTree = (node: IvrTreeNodeType, branchIndex: number | null = null) => (
    <TreeNode
      key={node.id}
      label={
        <div className="flex items-center mx-auto justify-center">
          {branchIndex !== null ? ` ${branchIndex + 1}: ${node.label}` : node.label}
          {canRemoveNode && node.id !== 1 && (
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => onRemoveNode && onRemoveNode(node.id)}
            >
              Remove
            </button>
          )}
        </div>
      }
    >
      {node.children.map((child, index) => renderTree(child, index))}
    </TreeNode>
  );

  return (
    <OrgTree
      lineWidth={'2px'}
      lineColor={'green'}
      lineBorderRadius={'10px'}
      label={tree.label}
    >
      {tree.children.map((child, index) => renderTree(child, index))}
    </OrgTree>
  );
};

export default Tree;
