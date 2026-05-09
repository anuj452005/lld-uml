"use client";

import { useState, useEffect, useCallback } from 'react';
import { useUMLStore } from '@/stores/umlStore';
import { useUIStore } from '@/stores/uiStore';
import { UMLClass, UMLVisibility, UMLField, UMLMethod } from '@/types/uml';

/**
 * useClassEditor
 * 
 * Manages the state and actions for the class editor panel.
 */
export const useClassEditor = () => {
  const { diagram, addClass, updateClass, deleteClass } = useUMLStore();
  const { selectedNodeId, isClassEditorOpen, setClassEditorOpen, setSelectedNode } = useUIStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<'class' | 'interface'>('class');
  const [visibility, setVisibility] = useState<UMLVisibility>('public');
  const [isAbstract, setIsAbstract] = useState(false);
  const [fields, setFields] = useState<UMLField[]>([]);
  const [methods, setMethods] = useState<UMLMethod[]>([]);

  const isEditMode = !!selectedNodeId;

  // Load existing class data if in edit mode
  useEffect(() => {
    if (isEditMode && diagram) {
      const cls = diagram.classes.find(c => c.id === selectedNodeId);
      if (cls) {
        setName(cls.name);
        setType('class'); // Currently only supporting classes in the editor
        setVisibility(cls.visibility);
        setIsAbstract(cls.isAbstract);
        setFields(cls.fields);
        setMethods(cls.methods);
      }
    } else {
      // Reset for new class
      setName('');
      setType('class');
      setVisibility('public');
      setIsAbstract(false);
      setFields([]);
      setMethods([]);
    }
  }, [isEditMode, selectedNodeId, diagram]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;

    if (isEditMode) {
      updateClass(selectedNodeId!, {
        name,
        visibility,
        isAbstract,
        fields,
        methods,
      });
    } else {
      const newClass: UMLClass = {
        id: crypto.randomUUID(),
        type: 'class',
        name,
        visibility,
        isAbstract,
        fields,
        methods,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addClass(newClass);
    }

    setClassEditorOpen(false);
    setSelectedNode(null);
  }, [name, visibility, isAbstract, fields, methods, isEditMode, selectedNodeId, addClass, updateClass, setClassEditorOpen, setSelectedNode]);

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      deleteClass(selectedNodeId);
      setClassEditorOpen(false);
      setSelectedNode(null);
    }
  }, [selectedNodeId, deleteClass, setClassEditorOpen, setSelectedNode]);

  const handleCancel = useCallback(() => {
    setClassEditorOpen(false);
    setSelectedNode(null);
  }, [setClassEditorOpen, setSelectedNode]);

  return {
    name,
    setName,
    type,
    setType,
    visibility,
    setVisibility,
    isAbstract,
    setIsAbstract,
    fields,
    setFields,
    methods,
    setMethods,
    handleSave,
    handleDelete,
    handleCancel,
    isEditMode,
    isOpen: isClassEditorOpen,
  };
};
