package com.uml.parser.contracts;

public class UmlRelationship {
    public String id;
    public String sourceId;
    public String targetId;
    public String type; // association, inheritance, realization, aggregation, composition, dependency
    public String label;
    public String createdAt;
}
