package com.uml.parser.parser;

import com.github.javaparser.StaticJavaParser;
import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.body.ClassOrInterfaceDeclaration;
import com.uml.parser.contracts.*;
import com.uml.parser.transformers.AstToUmlTransformer;
import com.uml.parser.validators.ParserValidator;
import java.util.ArrayList;
import java.util.List;

public class JavaSourceParser {
    public static ParseResponse parse(String source) {
        List<ParserWarning> warnings = new ArrayList<>();
        
        if (source == null || source.trim().isEmpty()) {
            List<ParserError> errors = new ArrayList<>();
            errors.add(new ParserError("EMPTY_SOURCE", "Source code is empty"));
            return ParseResponse.error(errors, warnings);
        }

        try {
            CompilationUnit cu = StaticJavaParser.parse(source);
            List<ClassOrInterfaceDeclaration> declarations = cu.findAll(ClassOrInterfaceDeclaration.class);
            
            // 1. Validate
            List<ParserError> errors = ParserValidator.validate(declarations);
            if (!errors.isEmpty()) {
                return ParseResponse.error(errors, warnings);
            }
            
            // 2. Transform
            UmlDiagram diagram = AstToUmlTransformer.transform(declarations);
            
            return ParseResponse.success(diagram, warnings);
            
        } catch (Exception e) {
            List<ParserError> errors = new ArrayList<>();
            errors.add(new ParserError("PARSE_ERROR", "Syntax error: " + e.getMessage()));
            return ParseResponse.error(errors, warnings);
        }
    }
}
