import React, { useState } from 'react'
import { IvrTreeNodeType } from '../../providers/types/IvrTreeNodeTypes'
import { Tree, TreeNode } from 'react-organizational-chart';

type Props = {}

const initialIvrTree: IvrTreeNodeType = {
  id: 1,
  label: "Root",
  parentId: null,
  children: []
}

const uploadedIvrList: string[] = ['intro', 'greeting', 'option', 'Message 1', 'Message 2'];

const IvrTreeForm = (props: Props) => {
  const [tree, setTree] = useState<IvrTreeNodeType>(initialIvrTree);
  const [newNode, setNewNode] = useState<{ parentId: string; label: string }>({
    parentId: '',
    label: '',
  });

  const addNode = () => {
    const addNodeRecursive = (node: IvrTreeNodeType) => {
      if (node.id === parseInt(newNode.parentId, 10)) {
        node.children.push({
          id: Date.now(),
          label: newNode.label,
          parentId: node.id,
          children: [],
        });
      } else {
        node.children.forEach(addNodeRecursive);
      }
    };

    const updatedTree = { ...tree };
    addNodeRecursive(updatedTree);
    setTree(updatedTree);
    setNewNode({ parentId: '', label: '' });
  };

  const removeNode = (nodeId: number) => {
    const removeNodeRecursive = (node: IvrTreeNodeType, id: number) => {
      node.children = node.children.filter((child) => child.id !== id);
      node.children.forEach((child) => removeNodeRecursive(child, id));
    };

    const updatedTree = { ...tree };
    if (updatedTree.id !== nodeId) {
      removeNodeRecursive(updatedTree, nodeId);
      setTree(updatedTree);
    }
  };

  const renderTree = (node: IvrTreeNodeType, branchIndex: number | null = null) => (
    <TreeNode
      key={node.id}
      label={
        <div className="flex items-center">
          {branchIndex !== null ? `Branch ${branchIndex + 1}: ${node.label}` : node.label}
          {node.id !== 1 && (
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={() => removeNode(node.id)}
            >
              Remove
            </button>
          )}
        </div>
      }
    >
      {node.children.map((child: any, index: number) => renderTree(child, index))}
    </TreeNode>
  );

  const getAllNodes = (node: IvrTreeNodeType, nodes: { id: number; label: string }[] = []) => {
    nodes.push({ id: node.id, label: node.label });
    node.children.forEach((child) => getAllNodes(child, nodes));
    return nodes;
  };

  const nodeOptions = getAllNodes(tree).map((node) => (
    <option key={node.id} value={node.id}>
      {node.label}
    </option>
  ));

  const nameOptions = uploadedIvrList.map((name, index) => (
    <option key={index} value={name}>
      {name}
    </option>
  ));

  return (
    <div className="p-4">
      <div className="mb-4">
        <select
          value={newNode.parentId}
          onChange={(e) => setNewNode({ ...newNode, parentId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Parent Node</option>
          {nodeOptions}
        </select>
        <select
          value={newNode.label}
          onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Node Label</option>
          {nameOptions}
        </select>
        <button
          onClick={addNode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Node
        </button>
      </div>
      <Tree
        lineWidth={'2px'}
        lineColor={'green'}
        lineBorderRadius={'10px'}
        label={tree.label}
      >
        {tree.children.map((child, index) => renderTree(child, index))}
      </Tree>
    </div>
  )
}

export default IvrTreeForm