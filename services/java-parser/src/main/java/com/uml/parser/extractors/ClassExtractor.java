package com.uml.parser.extractors;

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.Modifier;
import com.uml.parser.contracts.UmlClass;
import java.util.UUID;

public class ClassExtractor {
    public static UmlClass extract(ClassOrInterfaceDeclaration n) {
        UmlClass umlClass = new UmlClass();
        umlClass.id = UUID.randomUUID().toString();
        umlClass.name = n.getNameAsString();
        umlClass.isAbstract = n.isAbstract();
        
        // Visibility
        if (n.hasModifier(Modifier.Keyword.PUBLIC)) {
            umlClass.visibility = "public";
        } else if (n.hasModifier(Modifier.Keyword.PROTECTED)) {
            umlClass.visibility = "protected";
        } else if (n.hasModifier(Modifier.Keyword.PRIVATE)) {
            umlClass.visibility = "private";
        } else {
            umlClass.visibility = "package";
        }
        
        // Annotations (simplified)
        n.getAnnotations().forEach(a -> umlClass.annotations.add(a.getNameAsString()));
        
        return umlClass;
    }
}
