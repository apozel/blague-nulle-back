import NativeEvent from "./exception/NativeEvent";
import App from "./providers/App";

/**
 * Catches the process events
 */
NativeEvent.process();

/**
 * Clear the console before the app runs
 */
App.clearConsole();

/**
 * Load Configuration
 */
App.loadConfiguration();

App.loadDatabase();

/**
 * Run the Server
 */
App.loadServer();
