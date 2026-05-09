package com.uml.parser.contracts;

public class ParserWarning {
    public String code;
    public String message;
    public Integer line;

    public ParserWarning() {}

    public ParserWarning(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public ParserWarning(String code, String message, Integer line) {
        this.code = code;
        this.message = message;
        this.line = line;
    }
}
