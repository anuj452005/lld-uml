package com.uml.parser.extractors;

import com.github.javaparser.ast.body.MethodDeclaration;
import com.github.javaparser.ast.Modifier;
import com.uml.parser.contracts.UmlMethod;
import com.uml.parser.contracts.UmlMethodParameter;
import java.util.UUID;
import java.util.stream.Collectors;

public class MethodExtractor {
    public static UmlMethod extract(MethodDeclaration m) {
        UmlMethod method = new UmlMethod();
        method.id = UUID.randomUUID().toString();
        method.name = m.getNameAsString();
        method.returnType = m.getTypeAsString();
        method.isStatic = m.hasModifier(Modifier.Keyword.STATIC);
        method.isAbstract = m.isAbstract();
        
        // Visibility
        if (m.hasModifier(Modifier.Keyword.PUBLIC)) {
            method.visibility = "public";
        } else if (m.hasModifier(Modifier.Keyword.PROTECTED)) {
            method.visibility = "protected";
        } else if (m.hasModifier(Modifier.Keyword.PRIVATE)) {
            method.visibility = "private";
        } else {
            method.visibility = "package";
        }
        
        // Parameters
        m.getParameters().forEach(p -> {
            UmlMethodParameter param = new UmlMethodParameter();
            param.id = UUID.randomUUID().toString();
            param.name = p.getNameAsString();
            param.type = p.getTypeAsString();
            method.parameters.add(param);
        });
        
        // Signature generation: name(param: type, ...): returnType
        String paramsStr = method.parameters.stream()
            .map(p -> p.name + ": " + p.type)
            .collect(Collectors.joining(", "));
        method.signature = method.name + "(" + paramsStr + "): " + method.returnType;
        
        return method;
    }
}
