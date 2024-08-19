import React, { useState } from 'react';
import { IvrTreeNodeType } from '../../providers/types/IvrTreeNodeTypes';
import { Tree, TreeNode } from 'react-organizational-chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { ivrTreeSchema, ivrTreeSchemaType } from '../../providers/schema/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

type Props = {}

const initialIvrTree: IvrTreeNodeType = {
  id: 1,
  label: "Root",
  parentId: null,
  children: []
};

const uploadedIvrList: string[] = ['intro', 'greeting', 'option', 'Message 1', 'Message 2'];

const IvrTreeForm = (props: Props) => {
  const [tree, setTree] = useState<IvrTreeNodeType>(initialIvrTree);

  const form = useForm<ivrTreeSchemaType>({
    resolver: zodResolver(ivrTreeSchema),
    defaultValues: {
      parentId: 0,
      label: ""
    }
  });

  const addNode = (data: ivrTreeSchemaType) => {
    const addNodeRecursive = (node: IvrTreeNodeType) => {
      if (node.id === data.parentId) {
        node.children.push({
          id: Date.now(),
          label: data.label,
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
    form.reset({ parentId: 0, label: "" });
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
        <div className="flex items-center w-full mx-auto justify-center">
          {branchIndex !== null ? ` ${branchIndex + 1}: ${node.label}` : node.label}
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
      {node.children.map((child, index) => renderTree(child, index))}
    </TreeNode>
  );

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

  return (
    <Card className="w-[80%] overflow-auto">
      <CardHeader className='text-center space-y-5'>
        <CardTitle>Ivr Tree Setup</CardTitle>
        <CardDescription>Step: 3 Setup your uploaded ivr file with tree here!</CardDescription>
      </CardHeader>
      <CardContent className='overflow-auto'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addNode)} className='flex md:flex-row flex-col h-full justify-between items-center mt-5 lg:mb-12'>
            <div className="flex gap-x-3 flex-1">
              <FormField control={form.control} name='parentId' render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Parent IVR</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select parent ivr name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ivrTreeParentOptions}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name='label' render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>IVR Label</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select child ivr" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ivrOptionLists}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="w-full text-end flex-1 mt-7">
              <Button type='submit' className='px-10'>Add</Button>
            </div>
          </form>
        </Form>
        <Separator className='lg:mb-12' />
        <Tree
          lineWidth={'2px'}
          lineColor={'green'}
          lineBorderRadius={'10px'}
          label={tree.label}
        >
          {tree.children.map((child, index) => renderTree(child, index))}
        </Tree>
      </CardContent>
    </Card>
  )
}

export default IvrTreeForm;
