package com.uml.parser.contracts;

public class ParserError {
    public String code;
    public String message;
    public Integer line;
    public Integer column;

    public ParserError() {}

    public ParserError(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public ParserError(String code, String message, Integer line, Integer column) {
        this.code = code;
        this.message = message;
        this.line = line;
        this.column = column;
    }
}
