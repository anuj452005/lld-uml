package com.uml.parser.transformers;

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.MethodDeclaration;
import com.uml.parser.contracts.*;
import com.uml.parser.extractors.*;
import java.time.Instant;
import java.util.*;

public class AstToUmlTransformer {
    public static UmlDiagram transform(List<ClassOrInterfaceDeclaration> declarations) {
        UmlDiagram diagram = new UmlDiagram();
        diagram.id = UUID.randomUUID().toString();
        diagram.name = "Imported Java Diagram";
        diagram.createdAt = Instant.now().toString();
        diagram.updatedAt = diagram.createdAt;
        
        Map<String, String> nameToIdMap = new HashMap<>();
        
        // 1. First pass: Extract entities and build name->id map
        for (ClassOrInterfaceDeclaration n : declarations) {
            if (n.isInterface()) {
                UmlInterface intf = InterfaceExtractor.extract(n);
                intf.createdAt = diagram.createdAt;
                intf.updatedAt = diagram.updatedAt;
                diagram.interfaces.add(intf);
                nameToIdMap.put(intf.name, intf.id);
            } else {
                UmlClass cls = ClassExtractor.extract(n);
                cls.createdAt = diagram.createdAt;
                cls.updatedAt = diagram.updatedAt;
                diagram.classes.add(cls);
                nameToIdMap.put(cls.name, cls.id);
            }
        }
        
        // 2. Second pass: Extract fields, methods, and relationships
        for (ClassOrInterfaceDeclaration n : declarations) {
            String entityId = nameToIdMap.get(n.getNameAsString());
            
            if (n.isInterface()) {
                UmlInterface intf = diagram.interfaces.stream()
                    .filter(i -> i.id.equals(entityId)).findFirst().get();
                n.findAll(MethodDeclaration.class).forEach(m -> intf.methods.add(MethodExtractor.extract(m)));
            } else {
                UmlClass cls = diagram.classes.stream()
                    .filter(c -> c.id.equals(entityId)).findFirst().get();
                
                n.findAll(FieldDeclaration.class).forEach(f -> {
                    f.getVariables().forEach(v -> cls.fields.add(FieldExtractor.extract(f, v)));
                });
                
                n.findAll(MethodDeclaration.class).forEach(m -> cls.methods.add(MethodExtractor.extract(m)));
            }
            
            // Extract relationships
            diagram.relationships.addAll(RelationshipExtractor.extract(n, entityId, nameToIdMap));
        }
        
        return diagram;
    }
}
