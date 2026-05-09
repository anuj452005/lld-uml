package com.uml.parser.validators;

import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.github.javaparser.ast.type.ClassOrInterfaceType;
import com.uml.parser.contracts.ParserError;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ParserValidator {
    public static List<ParserError> validate(List<ClassOrInterfaceDeclaration> declarations) {
        List<ParserError> errors = new ArrayList<>();
        Set<String> names = new HashSet<>();
        
        for (ClassOrInterfaceDeclaration n : declarations) {
            String name = n.getNameAsString();
            
            // 1. Duplicate class names
            if (names.contains(name)) {
                errors.add(new ParserError(
                    "DUPLICATE_CLASS",
                    "Duplicate class/interface name found: " + name,
                    n.getBegin().map(p -> p.line).orElse(null),
                    n.getBegin().map(p -> p.column).orElse(null)
                ));
            }
            names.add(name);
            
            // 2. Self-inheritance
            for (ClassOrInterfaceType extendedType : n.getExtendedTypes()) {
                if (extendedType.getNameAsString().equals(name)) {
                    errors.add(new ParserError(
                        "SELF_INHERITANCE",
                        "Class cannot extend itself: " + name,
                        extendedType.getBegin().map(p -> p.line).orElse(null),
                        extendedType.getBegin().map(p -> p.column).orElse(null)
                    ));
                }
            }
            
            // 3. Self-realization
            for (ClassOrInterfaceType implementedType : n.getImplementedTypes()) {
                if (implementedType.getNameAsString().equals(name)) {
                    errors.add(new ParserError(
                        "SELF_INHERITANCE",
                        "Interface cannot be implemented by itself: " + name,
                        implementedType.getBegin().map(p -> p.line).orElse(null),
                        implementedType.getBegin().map(p -> p.column).orElse(null)
                    ));
                }
            }
        }
        
        return errors;
    }
}
