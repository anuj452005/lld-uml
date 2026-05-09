"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUMLStore } from '@/stores/umlStore';
import { useUIStore } from '@/stores/uiStore';
import { UMLClass, UMLVisibility, UMLField, UMLMethod } from '@/types/uml';
import { validateClassName, validateField, validateMethodSignature } from '@/lib/validation';

/**
 * useClassEditor
 * 
 * Manages the state and actions for the class editor panel.
 */
export const useClassEditor = () => {
  const { diagram, addClass, updateClass, deleteClass } = useUMLStore();
  const { selectedNodeId, isClassEditorOpen, setClassEditorOpen, setSelectedNode } = useUIStore();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [type, setType] = useState<'class' | 'interface'>('class');
  const [visibility, setVisibility] = useState<UMLVisibility>('public');
  const [isAbstract, setIsAbstract] = useState(false);
  const [fields, setFields] = useState<UMLField[]>([]);
  const [methods, setMethods] = useState<UMLMethod[]>([]);

  const isEditMode = !!selectedNodeId;

  const existingNames = useMemo(() => {
    if (!diagram) return [];

    return [
      ...diagram.classes.filter((cls) => cls.id !== selectedNodeId).map((cls) => cls.name),
      ...diagram.interfaces.filter((intf) => intf.id !== selectedNodeId).map((intf) => intf.name),
    ];
  }, [diagram, selectedNodeId]);

  const classNameValidation = useMemo(() => validateClassName(name, existingNames), [name, existingNames]);
  const fieldValidations = useMemo(() => fields.map((field) => validateField(field)), [fields]);
  const methodValidations = useMemo(() => methods.map((method) => validateMethodSignature(method.signature)), [methods]);
  const canSave = classNameValidation.valid && fieldValidations.every((result) => result.valid) && methodValidations.every((result) => result.valid);

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

  const validateName = useCallback(() => {
    const result = validateClassName(name, existingNames);
    setNameError(result.error);
    return result.valid;
  }, [name, existingNames]);

  const handleSave = useCallback(() => {
    const isNameValid = validateName();
    if (!isNameValid || !canSave) return;

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
  }, [name, visibility, isAbstract, fields, methods, isEditMode, selectedNodeId, addClass, updateClass, setClassEditorOpen, setSelectedNode, validateName, canSave]);

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
    nameError,
    validateName,
    handleSave,
    handleDelete,
    handleCancel,
    isEditMode,
    isOpen: isClassEditorOpen,
    canSave,
  };
};
