package com.uml.parser.contracts;

import java.util.ArrayList;
import java.util.List;

public class ParseResponse {
    public boolean success;
    public Data data = new Data();

    public static class Data {
        public UmlDiagram diagram;
        public List<ParserWarning> warnings = new ArrayList<>();
        public List<ParserError> errors = new ArrayList<>();
    }

    public static ParseResponse success(UmlDiagram diagram, List<ParserWarning> warnings) {
        ParseResponse response = new ParseResponse();
        response.success = true;
        response.data.diagram = diagram;
        response.data.warnings = warnings;
        return response;
    }

    public static ParseResponse error(List<ParserError> errors, List<ParserWarning> warnings) {
        ParseResponse response = new ParseResponse();
        response.success = false;
        response.data.errors = errors;
        response.data.warnings = warnings;
        return response;
    }
}
