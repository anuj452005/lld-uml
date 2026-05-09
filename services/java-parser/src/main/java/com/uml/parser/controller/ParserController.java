package com.uml.parser.controller;

import com.uml.parser.contracts.ParseRequest;
import com.uml.parser.contracts.ParseResponse;
import com.uml.parser.parser.JavaSourceParser;
import io.javalin.http.Context;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ParserController {
    private static final Logger logger = LoggerFactory.getLogger(ParserController.class);

    public static void handleParse(Context ctx) {
        try {
            ParseRequest request = ctx.bodyAsClass(ParseRequest.class);
            logger.info("Received parse request");
            
            ParseResponse response = JavaSourceParser.parse(request.source);
            
            ctx.json(response);
            if (response.success) {
                ctx.status(200);
                logger.info("Successfully parsed source");
            } else {
                ctx.status(200); // We return 200 even on parse errors as per spec, since it's a valid response object
                logger.warn("Parse failed with errors");
            }
        } catch (Exception e) {
            logger.error("Error handling parse request", e);
            ctx.status(500).result("Internal Server Error: " + e.getMessage());
        }
    }
}
