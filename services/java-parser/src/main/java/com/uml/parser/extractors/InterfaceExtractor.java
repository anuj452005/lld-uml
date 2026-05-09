package com.uml.parser.extractors;

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.uml.parser.contracts.UmlInterface;
import java.util.UUID;

public class InterfaceExtractor {
    public static UmlInterface extract(ClassOrInterfaceDeclaration n) {
        UmlInterface umlInterface = new UmlInterface();
        umlInterface.id = UUID.randomUUID().toString();
        umlInterface.name = n.getNameAsString();
        return umlInterface;
    }
}
