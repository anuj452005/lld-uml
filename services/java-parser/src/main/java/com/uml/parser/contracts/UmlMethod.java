package com.uml.parser.contracts;

import java.util.ArrayList;
import java.util.List;

public class UmlMethod {
    public String id;
    public String signature;
    public String name;
    public List<UmlMethodParameter> parameters = new ArrayList<>();
    public String returnType;
    public String visibility;
    public boolean isStatic;
    public boolean isAbstract;
}
