package com.uml.parser.extractors;

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.type.ClassOrInterfaceType;
import com.uml.parser.contracts.UmlRelationship;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class RelationshipExtractor {
    public static List<UmlRelationship> extract(ClassOrInterfaceDeclaration n, String sourceId, Map<String, String> nameToIdMap) {
        List<UmlRelationship> relationships = new ArrayList<>();
        
        // Inheritance (extends)
        for (ClassOrInterfaceType extendedType : n.getExtendedTypes()) {
            String targetName = extendedType.getNameAsString();
            if (nameToIdMap.containsKey(targetName)) {
                UmlRelationship rel = new UmlRelationship();
                rel.id = UUID.randomUUID().toString();
                rel.sourceId = sourceId;
                rel.targetId = nameToIdMap.get(targetName);
                rel.type = "inheritance";
                rel.createdAt = java.time.Instant.now().toString();
                relationships.add(rel);
            }
        }
        
        // Realization (implements)
        for (ClassOrInterfaceType implementedType : n.getImplementedTypes()) {
            String targetName = implementedType.getNameAsString();
            if (nameToIdMap.containsKey(targetName)) {
                UmlRelationship rel = new UmlRelationship();
                rel.id = UUID.randomUUID().toString();
                rel.sourceId = sourceId;
                rel.targetId = nameToIdMap.get(targetName);
                rel.type = "realization";
                rel.createdAt = java.time.Instant.now().toString();
                relationships.add(rel);
            }
        }
        
        return relationships;
    }
}
