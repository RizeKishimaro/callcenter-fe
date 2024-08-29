import { useState } from 'react';
import { IvrTreeNodeType } from '../../providers/types/IvrTreeNodeTypes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useDispatch } from 'react-redux';
import { nextStep, setIvrTree } from '../../store/reducers/setupReducer';
import Tree from '../Tree';

const uploadedIvrList: string[] = ['greeting', 'intro', 'option', 'mm', 'eng', "mm_above3years", "mm_under3years", "mm_3AboveKeyMessage", "mm_3UnderKeyMessage", "mm_CallToAgent", "eng_above3years", "eng_under3years", "eng_3AboveKeyMessage", "eng_3UnderKeyMessage", "eng_CallToAgent"];

const IvrTreeForm = () => {
  const [tree, setTree] = useState<IvrTreeNodeType | null>(null);
  const dispatch = useDispatch();
  const [parentId, setParentId] = useState<number>(1);
  const [label, setLabel] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [nextId, setNextId] = useState<number>(1);
  const [isLabelSelectDisabled, setIsLabelSelectDisabled] = useState<boolean>(true);

  const addNode = () => {
    if (!tree) {
      const newNode: IvrTreeNodeType = {
        id: nextId,
        label: label,
        type: type,
        parentId: null,
        branch: 1,
        children: [],
      };
      setTree(newNode);
      setNextId(nextId + 1);
    } else {
      const addNodeRecursive = (node: IvrTreeNodeType) => {
        if (node.id === parentId) {
          const newBranchNumber = node.children.length + 1;
          const newNode: IvrTreeNodeType = {
            id: nextId,
            label: type === 'queue' ? "Queue" : label,
            type: type,
            parentId: node.id,
            branch: newBranchNumber,
            children: [],
          };
          node.children.push(newNode);
          setNextId(nextId + 1);
        } else {
          node.children.forEach(addNodeRecursive);
        }
      };

      const updatedTree = { ...tree };
      addNodeRecursive(updatedTree);
      setTree(updatedTree);
    }

    // Reset form fields
    setParentId(1);
    setLabel("");
    setType("");
    setIsLabelSelectDisabled(true);
  };

  const removeNode = (nodeId: number) => {
    const removeNodeRecursive = (node: IvrTreeNodeType, id: number) => {
      node.children = node.children.filter((child) => child.id !== id);
      node.children.forEach((child) => removeNodeRecursive(child, id));
    };

    if (tree && tree.id !== nodeId) {
      const updatedTree = { ...tree };
      removeNodeRecursive(updatedTree, nodeId);
      setTree(updatedTree);
    } else {
      setTree(null); // If the root node is removed, reset the tree to null
    }
  };

  const getAllNodes = (node: IvrTreeNodeType | null, nodes: { id: number; label: string }[] = []): { id: number; label: string }[] => {
    if (!node) return nodes;

    nodes.push({ id: node.id, label: node.label });
    node.children.forEach((child) => getAllNodes(child, nodes));
    return nodes;
  };

  const ivrTreeParentOptions = getAllNodes(tree).map((node) => (
    <SelectItem key={node.id} value={node.id.toString()}>
      {`${node.id}: ${node.label}`}
    </SelectItem>
  ));

  const ivrOptionLists = uploadedIvrList.map((name, index) => (
    <SelectItem key={index} value={name}>
      {name}
    </SelectItem>
  ));

  const findNearestExtensionParent = (node: IvrTreeNodeType, tree: IvrTreeNodeType): IvrTreeNodeType | null => {
    const findParent = (currentNode: IvrTreeNodeType, parentId: number | null): IvrTreeNodeType | null => {
      if (!parentId) return null;

      const parent = findNodeById(tree, parentId);
      if (parent && parent.type === 'extension') {
        return parent;
      } else if (parent) {
        return findParent(parent, parent.parentId);
      }
      return null;
    };

    return findParent(node, node.parentId);
  };

  const findNodeById = (node: IvrTreeNodeType, id: number): IvrTreeNodeType | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
    return null;
  };

  const transformTreeToDto = (node: IvrTreeNodeType, campaignId: number) => {
    let adjustedParentId = node.parentId;

    if (node.type === 'queue') {
      const nearestExtensionParent = findNearestExtensionParent(node, tree as IvrTreeNodeType);
      if (nearestExtensionParent) {
        adjustedParentId = nearestExtensionParent.id;
      }
    }

    let ivrDtos = [{
      name: node.label,
      campaignId: campaignId,
      parentId: adjustedParentId ?? undefined,
      branch: node.branch || 1,
      type: node.type,
      value: node.label,
    }];

    node.children.forEach((child) => {
      ivrDtos = ivrDtos.concat(transformTreeToDto(child, campaignId));
    });

    return ivrDtos;
  };

  const handleSubmitIvrTree = () => {
    if (tree) {
      const campaignId = 1;
      const ivrDtos = transformTreeToDto(tree, campaignId);
      console.log(ivrDtos);
      dispatch(setIvrTree(tree));
      dispatch(nextStep());
    }
  };

  const handleTypeChange = (value: string) => {
    setType(value);
    if (value === 'extension' || value === 'playback') {
      setIsLabelSelectDisabled(false);
    } else {
      setIsLabelSelectDisabled(true);
      setLabel("");
    }
  };

  const isParentSelectDisabled = !tree;

  return (
    <Card className="w-[80%] overflow-auto">
      <CardHeader className='text-center space-y-5'>
        <CardTitle>Ivr Tree Setup</CardTitle>
        <CardDescription>Step: 3 Setup your uploaded ivr file with tree here!</CardDescription>
      </CardHeader>
      <CardContent className='overflow-auto'>
        <div className='flex md:flex-row flex-col h-full justify-between items-center mt-5 lg:mb-12'>
          <div className="flex gap-x-3 w-2/3">
            <div className='flex-1'>
              <label>Parent IVR</label>
              <Select onValueChange={(value) => setParentId(parseInt(value, 10))} value={parentId.toString()} disabled={isParentSelectDisabled}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select parent ivr name" />
                </SelectTrigger>
                <SelectContent>
                  {ivrTreeParentOptions}
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <label>IVR Type</label>
              <Select onValueChange={handleTypeChange} value={type}>
                <SelectTrigger>
                  <SelectValue placeholder="Please select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="extension">
                    Extension
                  </SelectItem>
                  <SelectItem value="queue">
                    Queue
                  </SelectItem>
                  <SelectItem value="playback">
                    Playback
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='flex-1'>
              <label>IVR Value</label>
              <Select
                onValueChange={setLabel}
                value={label}
                disabled={isLabelSelectDisabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Please select value" />
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
  );
};

export default IvrTreeForm;
