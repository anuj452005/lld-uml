package com.uml.parser.contracts;

import java.util.ArrayList;
import java.util.List;

public class UmlDiagram {
    public String id;
    public String name;
    public String description;
    public String sourceType = "java-generated";
    public List<UmlClass> classes = new ArrayList<>();
    public List<UmlInterface> interfaces = new ArrayList<>();
    public List<UmlRelationship> relationships = new ArrayList<>();
    public Layout layout = new Layout();
    public Viewport viewport = new Viewport();
    public Metadata metadata = new Metadata();
    public String createdAt;
    public String updatedAt;

    public static class Layout {
        public List<NodeLayout> nodes = new ArrayList<>();
    }

    public static class NodeLayout {
        public String entityId;
        public double x;
        public double y;
    }

    public static class Viewport {
        public double zoom = 1.0;
        public double x = 0.0;
        public double y = 0.0;
    }

    public static class Metadata {
        public boolean isModified = false;
        public String generatedFrom = "java";
        public String parserVersion = "1.0.0";
    }
}
