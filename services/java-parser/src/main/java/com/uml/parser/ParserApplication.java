package com.uml.parser;

import io.javalin.Javalin;
import com.uml.parser.controller.ParserController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ParserApplication {
    private static final Logger logger = LoggerFactory.getLogger(ParserApplication.class);
    private static final int PORT = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));

    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            config.router.mount(router -> {
                router.post("/parse", ParserController::handleParse);
                router.get("/health", ctx -> ctx.result("ok"));
            });
            config.requestLogger.http((ctx, ms) -> {
                logger.info("Request: {} {} - {}ms", ctx.method(), ctx.path(), ms);
            });
        }).start(PORT);

        logger.info("Java Parser Service started on port {}", PORT);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("Stopping Java Parser Service...");
            app.stop();
        }));
    }
}
