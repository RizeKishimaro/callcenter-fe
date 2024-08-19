import { useState } from 'react';
import { IvrTreeNodeType } from '../../providers/types/IvrTreeNodeTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useDispatch } from 'react-redux';
import { nextStep, setIvrTree } from '../../store/reducers/setupReducer';
import Tree from '../Tree';

const initialIvrTree: IvrTreeNodeType = {
  id: 1,
  label: "Root",
  parentId: null,
  children: []
};

const uploadedIvrList: string[] = ['intro', 'greeting', 'option', 'Message 1', 'Message 2'];

const IvrTreeForm = () => {
  const [tree, setTree] = useState<IvrTreeNodeType>(initialIvrTree);
  const dispatch = useDispatch();
  const [parentId, setParentId] = useState<number>(1);
  const [label, setLabel] = useState<string>("");

  const addNode = () => {
    const addNodeRecursive = (node: IvrTreeNodeType) => {
      if (node.id === parentId) {
        node.children.push({
          id: Date.now(),
          label: label,
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

    // Reset form fields
    setParentId(1);  // Set back to Root node
    setLabel("");
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

  const getAllNodes = (node: IvrTreeNodeType, nodes: { id: number; label: string }[] = []) => {
    nodes.push({ id: node.id, label: node.label });
    node.children.forEach((child) => getAllNodes(child, nodes));
    return nodes;
  };

  const ivrTreeParentOptions = getAllNodes(tree).map((node) => (
    <SelectItem key={node.id} value={node.id.toString()}>
      {node.label}
    </SelectItem>
  ));

  const ivrOptionLists = uploadedIvrList.map((name, index) => (
    <SelectItem key={index} value={name}>
      {name}
    </SelectItem>
  ));

  const handleSubmitIvrTree = () => {
    dispatch(setIvrTree(tree));
    dispatch(nextStep());
  }

  return (
    <Card className="w-[80%] overflow-auto">
      <CardHeader className='text-center space-y-5'>
        <CardTitle>Ivr Tree Setup</CardTitle>
        <CardDescription>Step: 3 Setup your uploaded ivr file with tree here!</CardDescription>
      </CardHeader>
      <CardContent className='overflow-auto'>
        <div className='flex md:flex-row flex-col h-full justify-between items-center mt-5 lg:mb-12'>
          <div className="flex gap-x-3 flex-1">
            <div className='flex-1'>
              <label>Parent IVR</label>
              <Select onValueChange={(value) => setParentId(parseInt(value, 10))} value={parentId.toString()}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select parent ivr name" />
                </SelectTrigger>
                <SelectContent>
                  {ivrTreeParentOptions}
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <label>IVR Label</label>
              <Select onValueChange={setLabel} value={label}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select child ivr" />
                </SelectTrigger>
                <SelectContent>
                  {ivrOptionLists}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full text-end flex-1 mt-7">
            <Button onClick={addNode} className='px-10'>Add</Button>
          </div>
        </div>
        <Separator className='lg:mb-12' />
        <div className="">
          <div className="h-full max-h-[550px] min-h-[300px] w-full overflow-auto scroll-smooth custom-scrollbar">
            <Tree tree={tree} onRemoveNode={removeNode} canRemoveNode={true} />
          </div>
          <div className="w-full text-end flex-1 mt-7">
            <Button onClick={handleSubmitIvrTree} className='px-10'>Submit Tree</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default IvrTreeForm;
