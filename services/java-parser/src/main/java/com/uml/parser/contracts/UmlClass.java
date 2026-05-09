package com.uml.parser.contracts;

import java.util.ArrayList;
import java.util.List;

public class UmlClass {
    public String id;
    public String name;
    public String type = "class";
    public String visibility; // public, private, protected, package
    public boolean isAbstract;
    public List<UmlField> fields = new ArrayList<>();
    public List<UmlMethod> methods = new ArrayList<>();
    public List<String> annotations = new ArrayList<>();
    public String createdAt;
    public String updatedAt;
}
