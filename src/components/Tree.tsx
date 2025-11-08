import React from 'react';
import { Tree as OrgTree, TreeNode } from 'react-organizational-chart';
import { IvrTreeNodeType } from '../providers/types/IvrTreeNodeTypes';
import { X } from 'lucide-react';

type TreeProps = {
  tree: IvrTreeNodeType | null;  // Allow tree to be null
  onRemoveNode?: (nodeId: number) => void;
  canRemoveNode: boolean;
};

const Tree: React.FC<TreeProps> = ({ tree, onRemoveNode, canRemoveNode }) => {
  if (!tree) {
    // If tree is null, render nothing or some placeholder
    return <div>No tree data available.</div>;
  }

  const renderTree = (node: IvrTreeNodeType, branchIndex: number | null = null) => {
    const formattedName = node.label.split('/').pop() || node.label;
    const displayName = formattedName.replace(/[_-]/g, ' ');
    return (
      <TreeNode
        key={node.id}
        label={
          <div className="flex items-center justify-center">
            <span>
              {branchIndex !== null ? `${branchIndex + 1}: ${displayName}` : node?.label}
            </span>
            {canRemoveNode && node.id !== 1 && (
              <button
                className="text-red-500 hover:text-red-700 -mt-4"
                onClick={() => onRemoveNode && onRemoveNode(node.id)}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        }
      >
        {node.children.map((child, index) => renderTree(child, index))}
      </TreeNode>
    )
  }

  return (
    <OrgTree
      lineWidth={'2px'}
      lineColor={'green'}
      lineBorderRadius={'10px'}
      label={tree?.label}
    >
      {tree.children.map((child, index) => renderTree(child, index))}
    </OrgTree>
  );
};

export default Tree;
