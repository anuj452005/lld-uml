package com.uml.parser.extractors;

import com.github.javaparser.ast.body.FieldDeclaration;
import com.github.javaparser.ast.body.VariableDeclarator;
import com.github.javaparser.ast.Modifier;
import com.uml.parser.contracts.UmlField;
import java.util.UUID;

public class FieldExtractor {
    public static UmlField extract(FieldDeclaration f, VariableDeclarator v) {
        UmlField field = new UmlField();
        field.id = UUID.randomUUID().toString();
        field.name = v.getNameAsString();
        field.type = v.getTypeAsString();
        field.isStatic = f.hasModifier(Modifier.Keyword.STATIC);
        field.isReadonly = f.hasModifier(Modifier.Keyword.FINAL);
        
        // Visibility
        if (f.hasModifier(Modifier.Keyword.PUBLIC)) {
            field.visibility = "public";
        } else if (f.hasModifier(Modifier.Keyword.PROTECTED)) {
            field.visibility = "protected";
        } else if (f.hasModifier(Modifier.Keyword.PRIVATE)) {
            field.visibility = "private";
        } else {
            field.visibility = "package";
        }
        
        v.getInitializer().ifPresent(i -> field.defaultValue = i.toString());
        
        return field;
    }
}
