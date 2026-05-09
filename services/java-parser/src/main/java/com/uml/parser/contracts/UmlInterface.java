package com.uml.parser.contracts;

import java.util.ArrayList;
import java.util.List;

public class UmlInterface {
    public String id;
    public String name;
    public String type = "interface";
    public List<UmlMethod> methods = new ArrayList<>();
    public String createdAt;
    public String updatedAt;
}
